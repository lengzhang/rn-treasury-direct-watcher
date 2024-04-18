import { FC, PropsWithChildren } from 'react'

import useDataContextProvider, { dataContext } from './useDataContextProvider'

const DataContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const value = useDataContextProvider()
    return <dataContext.Provider value={value}>{children}</dataContext.Provider>
}

export default DataContextProvider
