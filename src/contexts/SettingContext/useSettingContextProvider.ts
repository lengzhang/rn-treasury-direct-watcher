import { COLORMODES } from '@gluestack-style/react/lib/typescript/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useColorScheme } from 'react-native'

const STORAGE_KEY_COLOR_MODE = 'COLOR_MODE'

interface State {
    initialized: boolean
    colorMode?: COLORMODES
}

type Action =
    | { type: 'initialized'; colorMode?: COLORMODES }
    | { type: 'set-color-mode'; colorMode?: COLORMODES }

const initialState: State = {
    initialized: false,
    colorMode: undefined
}

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'initialized':
            return { ...state, initialized: true, colorMode: action.colorMode }

        case 'set-color-mode':
            return { ...state, colorMode: action.colorMode }

        default:
            return state
    }
}

const useSettingContextProvider = () => {
    const colorScheme = useColorScheme()
    const [state, dispatch] = useReducer(reducer, initialState)

    const finalColorMode = useMemo(
        () =>
            state.colorMode ||
            (colorScheme === 'light' ? 'light' : colorScheme === 'dark' ? 'dark' : undefined),
        [state.colorMode, colorScheme]
    )

    useEffect(() => {
        if (!state.initialized) restoreData()
    }, [state.initialized])

    useEffect(() => {
        if (state.initialized) persistData()
    }, [state.initialized, state.colorMode])

    async function restoreData() {
        try {
            const [colorModePair] = await AsyncStorage.multiGet([STORAGE_KEY_COLOR_MODE])
            let colorMode: COLORMODES | undefined = undefined
            if (colorModePair[1] === 'light' || colorModePair[1] === 'dark') {
                colorMode = colorModePair[1]
            }

            dispatch({ type: 'initialized', colorMode })
        } catch (error) {
            console.warn('Unable to retrieve storage data', error)
            dispatch({ type: 'initialized' })
        }
    }

    async function persistData() {
        try {
            if (!state.colorMode) await AsyncStorage.removeItem(STORAGE_KEY_COLOR_MODE)
            else {
                await AsyncStorage.setItem(STORAGE_KEY_COLOR_MODE, state.colorMode)
            }
        } catch (error) {
            console.warn('Unable to store data', error)
        }
    }

    function setColorMode(colorMode?: COLORMODES) {
        dispatch({ type: 'set-color-mode', colorMode })
    }

    return { ...state, finalColorMode, setColorMode }
}

export default useSettingContextProvider

export const settingContext = createContext<ReturnType<typeof useSettingContextProvider>>({
    ...initialState,
    finalColorMode: undefined,
    setColorMode: () => {}
})

export const useSettingContext = () => useContext(settingContext)
