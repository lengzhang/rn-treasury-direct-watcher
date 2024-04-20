import { config } from '@gluestack-ui/config'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'
import { FC, PropsWithChildren } from 'react'

import { DataContextProvider } from './contexts/DataContext'
import { SettingContextProvider, useSettingContext } from './contexts/SettingContext'

const AppWithMyContexts: FC<PropsWithChildren> = ({ children }) => {
    return (
        <SettingContextProvider>
            <DataContextProvider>{children}</DataContextProvider>
        </SettingContextProvider>
    )
}

const AppWithThirdPartyContexts: FC<PropsWithChildren> = ({ children }) => {
    const { finalColorMode } = useSettingContext()
    const statusBarStyle: StatusBarStyle =
        finalColorMode === 'light' ? 'dark' : finalColorMode === 'dark' ? 'light' : 'auto'

    return (
        <GluestackUIProvider config={config} colorMode={finalColorMode}>
            <StatusBar style={statusBarStyle} />
            {children}
        </GluestackUIProvider>
    )
}

const AppContexts: FC<PropsWithChildren> = ({ children }) => {
    return (
        <AppWithMyContexts>
            <AppWithThirdPartyContexts>{children}</AppWithThirdPartyContexts>
        </AppWithMyContexts>
    )
}

export default AppContexts
