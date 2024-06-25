import { Card, Heading, HStack, Icon, ScrollView } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { ChevronRightIcon } from 'lucide-react-native'
import { FC } from 'react'
import { Pressable } from 'react-native'

import { MenuScreenComponentType, StackNavigation } from '@/Router'
import ColorModeButtonGroup from '@/components/ColorModeButtonGroup'

const MenuScreen: FC<MenuScreenComponentType> = () => {
    const navigation = useNavigation<StackNavigation>()

    const goDataManagementScreen = () => {
        navigation.navigate('Data management')
    }

    return (
        <ScrollView>
            <Pressable onPress={goDataManagementScreen}>
                {({ pressed }) => (
                    <Card
                        variant="elevated"
                        borderRadius="$none"
                        marginTop="$2"
                        $dark-backgroundColor={
                            pressed ? '$backgroundDark800' : '$backgroundDark900'
                        }
                        $light-backgroundColor={
                            pressed ? '$backgroundLight50' : '$backgroundLight0'
                        }>
                        <HStack justifyContent="space-between" alignItems="center">
                            <Heading>Data management</Heading>
                            <Icon as={ChevronRightIcon} size="xl" />
                        </HStack>
                    </Card>
                )}
            </Pressable>
            <Card variant="elevated" borderRadius="$none" marginTop="$2">
                <HStack justifyContent="space-between" alignItems="center">
                    <Heading>Color mode</Heading>
                    <ColorModeButtonGroup />
                </HStack>
            </Card>
        </ScrollView>
    )
}

export default MenuScreen
