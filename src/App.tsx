import registerRootComponent from 'expo/build/launch/registerRootComponent'

import AppContexts from './AppContexts'
import Router from './Router'

function App() {
    return (
        <AppContexts>
            <Router />
        </AppContexts>
    )
}

export default registerRootComponent(App)
