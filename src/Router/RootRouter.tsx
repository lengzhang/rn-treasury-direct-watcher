import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RootStackParamList } from './types'

import { useSettingContext } from '@/contexts/SettingContext'
import DataManagementScreen from '@/screens/DataManagementScreen'
import DetailScreen from '@/screens/DetailScreen'
import HomeScreen from '@/screens/HomeScreen'
import MenuScreen from '@/screens/MenuScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootRouter = () => {
    const { finalColorMode } = useSettingContext()
    const theme: Theme = finalColorMode === 'dark' ? DarkTheme : DefaultTheme

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Menu" component={MenuScreen} />
                <Stack.Screen name="Data management" component={DataManagementScreen} />
                <Stack.Screen name="Detail" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootRouter
