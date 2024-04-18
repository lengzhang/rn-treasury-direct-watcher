import { config } from '@gluestack-ui/config'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { StatusBar } from 'expo-status-bar'
import { FC, PropsWithChildren } from 'react'

import { DataContextProvider } from './contexts/DataContext'

const AppWithMyContexts: FC<PropsWithChildren> = ({ children }) => {
    return <DataContextProvider>{children}</DataContextProvider>
}

const AppWithThirdPartyContexts: FC<PropsWithChildren> = ({ children }) => {
    return (
        <GluestackUIProvider config={config}>
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
