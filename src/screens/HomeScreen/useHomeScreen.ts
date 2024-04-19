import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import __ from 'ramda'
import { useEffect, useMemo, useReducer } from 'react'

import { SECURITY_TYPE_TERM_MAPPER, SECURITY_TYPES } from '@/constants/treasuryDirect'
import { useDataContext } from '@/contexts/DataContext'
import { SECURITY_TYPES_TYPE } from '@/types/treasuryDirect'

const SECURITY_ID_REGEX = new RegExp(/^.+_/)

const STORAGE_KEYS = {
    SELECTED_TYPE: 'SELECTED_TYPE',
    SELECTED_TERM: 'SELECTED_TERM'
}

interface State {
    initialized: boolean
    type: SECURITY_TYPES_TYPE
    term: string
}

type Action =
    | { type: 'initialized'; value?: Pick<State, 'type' | 'term'> }
    | { type: 'set-type'; value: SECURITY_TYPES_TYPE }
    | { type: 'set-term'; value: string }

const initialState: State = {
    initialized: false,
    type: SECURITY_TYPES[0],
    term: SECURITY_TYPE_TERM_MAPPER[SECURITY_TYPES[0]][0]
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'initialized':
            return { ...state, initialized: true, ...(action.value || {}) }

        case 'set-type':
            return {
                ...state,
                type: action.value,
                term: SECURITY_TYPE_TERM_MAPPER[action.value][0]
            }

        case 'set-term':
            return { ...state, term: action.value }

        default:
            return state
    }
}

const useHomeScreen = () => {
    const navigation = useNavigation()
    const dataContext = useDataContext()
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    // Retrieve state from storage
    useEffect(() => {
        retrieveStateFromStorage()
    }, [])

    // When state is updated
    useEffect(() => {
        if (state.initialized) {
            persistStateToStorage()
        }
    }, [state.initialized, state.type, state.term])

    async function persistStateToStorage() {
        try {
            await AsyncStorage.multiSet([
                [STORAGE_KEYS.SELECTED_TYPE, state.type],
                [STORAGE_KEYS.SELECTED_TERM, state.term]
            ])
            console.log('useHomeScreen => Success persist state')
        } catch (error) {
            console.error('useHomeScreen => Persist state failed: ', error)
        }
    }

    async function retrieveStateFromStorage() {
        let storedState: Pick<State, 'type' | 'term'> | undefined = undefined
        try {
            const pairs = await AsyncStorage.multiGet([
                STORAGE_KEYS.SELECTED_TYPE,
                STORAGE_KEYS.SELECTED_TERM
            ])

            if (pairs[0][1]) {
                const type = pairs[0][1] as SECURITY_TYPES_TYPE
                if (SECURITY_TYPES.includes(type)) {
                    let term = pairs[1][1]
                    if (!term || !SECURITY_TYPE_TERM_MAPPER[type].includes(term)) {
                        term = SECURITY_TYPE_TERM_MAPPER[type][0]
                    }
                    storedState = { type, term }
                }
            }
            console.log('useHomeScreen => Success retrieve state')
        } catch (error) {
            console.error('useHomeScreen => Unable to get state from storage: ', error)
        }
        dispatch({ type: 'initialized', value: storedState })
    }

    const onSelectType = (value: SECURITY_TYPES_TYPE) => () => {
        if (value === state.type) return
        dispatch({ type: 'set-type', value })
    }

    const onSelectTerm = (value: string) => () => {
        if (value === state.term) return
        dispatch({ type: 'set-term', value })
    }

    const securityIds = useMemo(() => {
        if (!dataContext.initialized) return []
        const ids = __.sort((a, b) => {
            return b.replace(SECURITY_ID_REGEX, '').localeCompare(a.replace(SECURITY_ID_REGEX, ''))
        }, dataContext.securityTypeTermMapper?.[state.type]?.[state.term]?.securities || [])
        return ids
    }, [dataContext.initialized, dataContext.securityTypeTermMapper, state.type, state.term])

    return {
        ...state,
        securityIds,
        isFetching: dataContext.isFetching,
        onSelectType,
        onSelectTerm
    }
}

export default useHomeScreen
