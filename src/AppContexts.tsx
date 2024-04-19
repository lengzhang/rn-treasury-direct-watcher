import { config } from '@gluestack-ui/config'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { StatusBar } from 'expo-status-bar'
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

    return (
        <GluestackUIProvider config={config} colorMode={finalColorMode}>
            <StatusBar style="auto" />
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
