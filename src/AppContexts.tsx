import { FC, PropsWithChildren } from 'react'

import { DataContextProvider } from './contexts/DataContext'

const AppWithMyContexts: FC<PropsWithChildren> = ({ children }) => {
    return <DataContextProvider>{children}</DataContextProvider>
}

const AppWithThirdPartyContexts: FC<PropsWithChildren> = ({ children }) => {
    return children
}

const AppContexts: FC<PropsWithChildren> = ({ children }) => {
    return (
        <AppWithMyContexts>
            <AppWithThirdPartyContexts>{children}</AppWithThirdPartyContexts>
        </AppWithMyContexts>
    )
}

export default AppContexts
