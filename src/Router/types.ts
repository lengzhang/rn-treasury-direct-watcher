import { NavigationProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export type RootStackParamList = {
    Home: undefined
    Menu: undefined
    'Data management': undefined
    Detail: { id: string }
}

export type HomeScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Home'>
export type MenuScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Menu'>
export type DataManagementScreenComponentType = NativeStackScreenProps<
    RootStackParamList,
    'Data management'
>
export type DetailScreenComponentType = NativeStackScreenProps<RootStackParamList, 'Detail'>

export type StackNavigation = NavigationProp<RootStackParamList>
