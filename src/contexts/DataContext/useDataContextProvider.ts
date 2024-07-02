import AsyncStorage from '@react-native-async-storage/async-storage'
import R from 'ramda'
import { createContext, useContext, useEffect, useReducer } from 'react'

import { ONE_DAY_OFFSET, STORAGE_KEYS } from './constants'
import { Action, SecurityTypeTermMapperType, State } from './types'

import useRetrieveRecentTreasuryDirectData from '@/hooks/useRetrieveRecentTreasuryDirectData'
import useRetrieveTreasuryDirectData from '@/hooks/useRetrieveTreasuryDirectData'
import { Security } from '@/types/treasuryDirect'
import { parseSecurityTerm } from '@/utils/treasuryDirect'

const initialState: State = {
    initialized: false,
    securityTypeTermMapper: Object.create(null),
    securityMapper: Object.create(null),
    lastUpdatedAt: 0,
    oldDataPageNum: 1
}

const mergeAndSort = R.pipe(
    R.concat,
    R.uniq<string>,
    R.sort((a: string, b: string) => b.localeCompare(a))
)

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'initialized':
            return {
                ...state,
                ...(action?.storedState || Object.create(null)),
                initialized: true
            }

        case 'merge-data':
            return {
                ...state,
                securityTypeTermMapper: R.mergeDeepWithKey(
                    (k, l, r) => {
                        if (k !== 'securities') return r
                        return mergeAndSort(l, r)
                    },
                    state.securityTypeTermMapper,
                    action.securityTypeTermMapper
                ),
                securityMapper: R.mergeDeepRight(state.securityMapper, action.securityMapper),
                lastUpdatedAt: Date.now()
            }

        case 'set-old-data-page-number':
            return { ...state, oldDataPageNum: action.value }

        default:
            return state
    }
}

const produceSecurities = (
    securities: Security[],
    securityTypeTermMapper: SecurityTypeTermMapperType,
    securityMapper: Record<string, Security>
) => {
    for (const security of securities) {
        const { cusip, issueDate, type, securityTerm } = security

        if (!securityTerm) break

        if (!securityTypeTermMapper[type]) securityTypeTermMapper[type] = Object.create(null)
        if (!securityTypeTermMapper[type][securityTerm]) {
            securityTypeTermMapper[type][securityTerm] = {
                ...parseSecurityTerm(securityTerm),
                term: securityTerm,
                securities: []
            }
        }

        const id = `${issueDate}_${cusip}`
        securityTypeTermMapper[type][securityTerm].securities.push(id)
        securityMapper[id] = { ...security }
    }
}

const useDataContextProvider = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const recentDataControl = useRetrieveRecentTreasuryDirectData(loadRecentSecurities)
    const oldDataControl = useRetrieveTreasuryDirectData(loadOldSecurities)

    // Retrieve data from storage
    useEffect(() => {
        retrieveDataFromStorage()
    }, [])

    // When data is outage
    useEffect(() => {
        if (state.initialized && recentDataControl.state.status === 'ideal') {
            if (Date.now() - state.lastUpdatedAt > ONE_DAY_OFFSET) {
                recentDataControl.getRecentTreasuryDirectData()
            } else {
                persistDataToStorage()
            }
        }
    }, [state.initialized, recentDataControl.state.status, state.lastUpdatedAt])

    // Continue getting old data in background
    useEffect(() => {
        if (
            state.initialized &&
            oldDataControl.state.status === 'ideal' &&
            state.oldDataPageNum > 0
        ) {
            oldDataControl.getTreasuryDirectData(state.oldDataPageNum)
        }
    }, [state.initialized, oldDataControl.state.status, state.oldDataPageNum])

    async function persistDataToStorage() {
        try {
            await AsyncStorage.multiSet([
                [
                    STORAGE_KEYS.SECURITY_TYPE_TERM_MAPPER,
                    JSON.stringify(state.securityTypeTermMapper)
                ],
                [STORAGE_KEYS.SECURITY_MAPPER, JSON.stringify(state.securityMapper)],
                [STORAGE_KEYS.LAST_UPDATED_AT, state.lastUpdatedAt.toString()],
                [STORAGE_KEYS.OLD_DATA_PAGE_NUM, state.oldDataPageNum.toString()]
            ])
            console.log(`Success persist ${R.keys(state.securityMapper).length} securities`)
        } catch (error) {
            console.error('Store treasury direct data failed: ', error)
        }
    }

    async function retrieveDataFromStorage() {
        console.log('Start retrieve data from storage')

        let storedState:
            | Pick<
                  State,
                  'securityTypeTermMapper' | 'securityMapper' | 'lastUpdatedAt' | 'oldDataPageNum'
              >
            | undefined = undefined

        try {
            const pairs = await AsyncStorage.multiGet([
                STORAGE_KEYS.SECURITY_TYPE_TERM_MAPPER,
                STORAGE_KEYS.SECURITY_MAPPER,
                STORAGE_KEYS.LAST_UPDATED_AT,
                STORAGE_KEYS.OLD_DATA_PAGE_NUM
            ])

            storedState = {
                securityTypeTermMapper: pairs[0][1]
                    ? JSON.parse(pairs[0][1])
                    : initialState.securityTypeTermMapper,
                securityMapper: pairs[1][1] ? JSON.parse(pairs[1][1]) : initialState.securityMapper,
                lastUpdatedAt: pairs[2][1]
                    ? parseInt(pairs[2][1] || '', 10)
                    : initialState.lastUpdatedAt,
                oldDataPageNum: pairs[3][1]
                    ? parseInt(pairs[3][1] || '', 10)
                    : initialState.oldDataPageNum
            }
            console.log(`Success retrieve ${R.keys(storedState.securityMapper).length} securities`)
        } catch (error) {
            console.error('Unable to get data from storage: ', error)
        }
        dispatch({ type: 'initialized', storedState })
    }

    async function clearAllData() {
        await AsyncStorage.clear()
        dispatch({ type: 'initialized', storedState: { ...initialState } })
    }

    async function loadRecentSecurities(securities: Security[], error: any | null) {
        if (error === null && securities.length > 0) {
            const { securityTypeTermMapper, securityMapper } = R.clone(initialState)
            produceSecurities(securities, securityTypeTermMapper, securityMapper)
            dispatch({ type: 'merge-data', securityTypeTermMapper, securityMapper })
        }
    }

    async function loadOldSecurities(securities: Security[], error: any | null) {
        if (error === null) {
            if (securities.length > 0) {
                const { securityTypeTermMapper, securityMapper } = R.clone(initialState)
                produceSecurities(securities, securityTypeTermMapper, securityMapper)
                dispatch({ type: 'merge-data', securityTypeTermMapper, securityMapper })
                dispatch({ type: 'set-old-data-page-number', value: state.oldDataPageNum + 1 })
            } else {
                dispatch({ type: 'set-old-data-page-number', value: -1 })
            }
        }
    }

    const refreshAllData = async () => {
        await AsyncStorage.clear()
        dispatch({ type: 'initialized', storedState: { ...initialState } })
        dispatch({ type: 'set-old-data-page-number', value: initialState.oldDataPageNum })
    }

    return {
        ...state,
        isFetchingLatest: recentDataControl.state.status === 'fetching',
        getRecentTreasuryDirectData: recentDataControl.getRecentTreasuryDirectData,
        refreshAllData,
        clearAllData
    }
}

export default useDataContextProvider

export const dataContext = createContext<ReturnType<typeof useDataContextProvider>>({
    ...initialState,
    isFetchingLatest: false,
    getRecentTreasuryDirectData: async () => {},
    refreshAllData: async () => {},
    clearAllData: async () => {}
})

export const useDataContext = () => useContext(dataContext)
