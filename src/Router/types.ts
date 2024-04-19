import { NavigationProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Home: undefined
    Menu: undefined
}

export type HomeScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Home'>
export type MenuScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Menu'>

export type StackNavigation = NavigationProp<RootStackParamList>
