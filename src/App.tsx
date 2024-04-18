import registerRootComponent from 'expo/build/launch/registerRootComponent'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

import AppContexts from './AppContexts'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

function App() {
    return (
        <AppContexts>
            <View style={styles.container}>
                <Text>Open up App.tsx to start working on your app!</Text>
                <StatusBar style="auto" />
            </View>
        </AppContexts>
    )
}

export default registerRootComponent(App)
