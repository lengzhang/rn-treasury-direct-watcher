import { NavigationProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Home: undefined
    Menu: undefined
    'Data management': undefined
}

export type HomeScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Home'>
export type MenuScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Menu'>
export type DataManagementScreenComponentType = NativeStackScreenProps<
    RootStackParamList,
    'Data management'
>

export type StackNavigation = NavigationProp<RootStackParamList>
