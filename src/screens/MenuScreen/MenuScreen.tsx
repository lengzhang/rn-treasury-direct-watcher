import { Card, Heading, HStack, ScrollView } from '@gluestack-ui/themed'
import { FC } from 'react'

import { MenuScreenComponentType } from '@/Router'
import ColorModeButtonGroup from '@/components/ColorModeButtonGroup'

const MenuScreen: FC<MenuScreenComponentType> = () => {
    return (
        <ScrollView>
            <Card variant="elevated" borderRadius="$none" marginTop="$2">
                <HStack justifyContent="space-between">
                    <Heading>Color mode</Heading>
                    <ColorModeButtonGroup />
                </HStack>
            </Card>
        </ScrollView>
    )
}

export default MenuScreen
