import { Button, ButtonIcon, ButtonText } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { MenuIcon } from 'lucide-react-native'
import { ComponentProps, FC, memo } from 'react'

import { StackNavigation } from '@/Router'

const MenuButton: FC<ComponentProps<typeof Button>> = ({
    size = 'xs',
    variant = 'outline',
    marginRight = '$2',
    ...props
}) => {
    const navigation = useNavigation<StackNavigation>()

    return (
        <Button
            size={size}
            variant={variant}
            marginRight={marginRight}
            {...props}
            onPress={() => {
                navigation.navigate('Menu')
            }}>
            <ButtonIcon as={MenuIcon} marginRight="$2" />
            <ButtonText>Menu</ButtonText>
        </Button>
    )
}

export default memo(MenuButton)
