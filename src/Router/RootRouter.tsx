import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RootStackParamList } from './types'

import HomeScreen from '@/screens/HomeScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootRouter = () => {
    return (
        <NavigationContainer theme={DefaultTheme}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootRouter
