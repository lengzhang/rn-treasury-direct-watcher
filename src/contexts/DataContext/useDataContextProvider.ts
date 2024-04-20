import AsyncStorage from '@react-native-async-storage/async-storage'
import __ from 'ramda'
import { createContext, useContext, useEffect, useReducer } from 'react'

import {
    DEFAULT_RECENT_FETCH_DAYS,
    FETCH_PAGE_SIZE,
    ONE_DAY_OFFSET,
    STORAGE_KEYS
} from './constants'
import { Action, State } from './types'

import { SECURITY_TYPES } from '@/constants/treasuryDirect'
import { getAnnouncedSecurities, parseSecurityTerm, searchSecurities } from '@/utils/treasuryDirect'

const initialState: State = {
    initialized: false,
    isFetchingLatest: false,
    isFetchingAll: false,
    securityTypeTermMapper: Object.create(null),
    securityMapper: Object.create(null),
    lastUpdatedAt: 0
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'initialized':
            return {
                ...state,
                ...(action?.storedState || Object.create(null)),
                initialized: true
            }

        case 'set-is-fetching-latest':
            return { ...state, isFetchingLatest: action.value }

        case 'set-is-fetching-all':
            return { ...state, isFetchingAll: action.value }

        case 'merge-data':
            return {
                ...state,
                securityTypeTermMapper: __.mergeAll([
                    state.securityTypeTermMapper,
                    action.securityTypeTermMapper
                ]),
                securityMapper: __.mergeAll([state.securityMapper, action.securityMapper]),
                lastUpdatedAt: Date.now()
            }

        default:
            return state
    }
}

const useDataContextProvider = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Retrieve data from storage
    useEffect(() => {
        retrieveDataFromStorage()
    }, [])

    // When data is outage
    useEffect(() => {
        if (state.initialized && !state.isFetchingLatest && !state.isFetchingAll) {
            if (Date.now() - state.lastUpdatedAt > ONE_DAY_OFFSET) {
                getRecentTreasuryDirectData()
            } else {
                persistDataToStorage()
            }
        }
    }, [state.initialized, state.isFetchingLatest, state.isFetchingAll, state.lastUpdatedAt])

    async function persistDataToStorage() {
        try {
            await AsyncStorage.multiSet([
                [
                    STORAGE_KEYS.SECURITY_TYPE_TERM_MAPPER,
                    JSON.stringify(state.securityTypeTermMapper)
                ],
                [STORAGE_KEYS.SECURITY_MAPPER, JSON.stringify(state.securityMapper)],
                [STORAGE_KEYS.LAST_UPDATED_AT, state.lastUpdatedAt.toString()]
            ])
            console.log(`Success persist ${__.keys(state.securityMapper).length} securities`)
        } catch (error) {
            console.error('Store treasury direct data failed: ', error)
        }
    }

    async function retrieveDataFromStorage() {
        console.log('Start retrieve data from storage')

        let storedState:
            | Pick<State, 'securityTypeTermMapper' | 'securityMapper' | 'lastUpdatedAt'>
            | undefined = undefined

        try {
            const pairs = await AsyncStorage.multiGet([
                STORAGE_KEYS.SECURITY_TYPE_TERM_MAPPER,
                STORAGE_KEYS.SECURITY_MAPPER,
                STORAGE_KEYS.LAST_UPDATED_AT
            ])

            storedState = {
                securityTypeTermMapper: pairs[0][1]
                    ? JSON.parse(pairs[0][1])
                    : initialState.securityTypeTermMapper,
                securityMapper: pairs[1][1] ? JSON.parse(pairs[1][1]) : initialState.securityMapper,
                lastUpdatedAt: pairs[2][1]
                    ? parseInt(pairs[2][1] || '', 10)
                    : initialState.lastUpdatedAt
            }
            console.log(`Success retrieve ${__.keys(storedState.securityMapper).length} securities`)
        } catch (error) {
            console.error('Unable to get data from storage: ', error)
        }
        dispatch({ type: 'initialized', storedState })
    }

    async function getRecentTreasuryDirectData(days: number = DEFAULT_RECENT_FETCH_DAYS) {
        if (state.isFetchingLatest) return

        dispatch({ type: 'set-is-fetching-latest', value: true })

        try {
            console.log('Start getting recent securities from Treasury Direct')
            const { securityTypeTermMapper, securityMapper } = __.clone(initialState)

            const allSecurities = await Promise.all(
                SECURITY_TYPES.map((type) => getAnnouncedSecurities({ type, days }))
            )

            for (let i = 0; i < allSecurities.length; i++) {
                const securities = allSecurities[i]
                console.log(`Got ${securities.length} securities for ${SECURITY_TYPES[i]}`)

                for (const security of securities) {
                    const { cusip, issueDate, type, securityTerm } = security

                    if (!securityTerm) break

                    if (!securityTypeTermMapper[type])
                        securityTypeTermMapper[type] = Object.create(null)
                    if (!securityTypeTermMapper[type][securityTerm]) {
                        securityTypeTermMapper[type][securityTerm] = {
                            ...parseSecurityTerm(securityTerm),
                            term: securityTerm,
                            securities: []
                        }
                    }

                    const id = `${cusip}_${issueDate}`
                    securityTypeTermMapper[type][securityTerm].securities.push(id)
                    securityMapper[id] = { ...security }
                }
            }

            console.log(
                `Success retrieve ${__.keys(securityMapper).length} recent securities from Treasury Direct`
            )

            dispatch({ type: 'merge-data', securityTypeTermMapper, securityMapper })
        } catch (error) {
            console.error('Unable to fetch treasury direct data: ', error)
        }
        dispatch({ type: 'set-is-fetching-latest', value: false })
    }

    async function getTreasuryDirectData() {
        if (state.isFetchingAll) return

        dispatch({ type: 'set-is-fetching-all', value: true })
        try {
            console.log('Start getting securities from Treasury Direct')
            const { securityTypeTermMapper, securityMapper } = __.clone(initialState)

            for (let pageNum = 0; true; pageNum++) {
                console.log('Fetching page number ', pageNum)
                const securities = await searchSecurities({
                    pageNum,
                    pageSize: FETCH_PAGE_SIZE,
                    endIssueDate: new Date()
                })

                console.log(`Got ${securities.length} securities.`)
                if (!securities?.length) break

                for (const security of securities) {
                    const { cusip, issueDate, type, securityTerm } = security

                    if (!securityTerm) break
                    if (!securityTypeTermMapper[type])
                        securityTypeTermMapper[type] = Object.create(null)
                    if (!securityTypeTermMapper[type][securityTerm]) {
                        securityTypeTermMapper[type][securityTerm] = {
                            ...parseSecurityTerm(securityTerm),
                            term: securityTerm,
                            securities: []
                        }
                    }

                    const id = `${cusip}_${issueDate}`
                    securityTypeTermMapper[type][securityTerm].securities.push(id)
                    securityMapper[id] = { ...security }
                }
            }

            dispatch({ type: 'merge-data', securityTypeTermMapper, securityMapper })
        } catch (error) {
            console.error('Unable to fetch treasury direct data: ', error)
        }
        dispatch({ type: 'set-is-fetching-all', value: false })
    }

    async function clearAllData() {
        await AsyncStorage.clear()
        dispatch({ type: 'initialized', storedState: { ...initialState } })
    }

    return { ...state, getRecentTreasuryDirectData, getTreasuryDirectData, clearAllData }
}

export default useDataContextProvider

export const dataContext = createContext<ReturnType<typeof useDataContextProvider>>({
    ...initialState,
    getRecentTreasuryDirectData: async () => {},
    getTreasuryDirectData: async () => {},
    clearAllData: async () => {}
})

export const useDataContext = () => useContext(dataContext)
