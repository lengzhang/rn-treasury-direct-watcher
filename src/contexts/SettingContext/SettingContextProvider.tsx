import { FC, PropsWithChildren } from 'react'

import useSettingContextProvider, { settingContext } from './useSettingContextProvider'

const SettingContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const value = useSettingContextProvider()
    return <settingContext.Provider value={value}>{children}</settingContext.Provider>
}

export default SettingContextProvider
