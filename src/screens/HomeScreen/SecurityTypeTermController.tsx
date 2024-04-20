import {
    Box,
    Button,
    ButtonIcon,
    ButtonText,
    HStack,
    Pressable,
    ScrollView,
    Text
} from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { MenuIcon } from 'lucide-react-native'
import { ComponentProps, FC, memo, useMemo } from 'react'

import { StackNavigation } from '@/Router'
import { SECURITY_TYPE_TERM_MAPPER, SECURITY_TYPES } from '@/constants/treasuryDirect'
import { SECURITY_TYPES_TYPE } from '@/types/treasuryDirect'

const MenuButton = memo(() => {
    const navigation = useNavigation<StackNavigation>()

    return (
        <Button
            size="xs"
            variant="outline"
            marginRight="$2"
            onPress={() => {
                navigation.navigate('Menu')
            }}>
            <ButtonIcon as={MenuIcon} marginRight="$2" />
            <ButtonText>Menu</ButtonText>
        </Button>
    )
})

const TabText: FC<{ isSelected: boolean; text: string; sub?: boolean }> = ({
    isSelected,
    text,
    sub = false
}) => {
    const textProps: ComponentProps<typeof Text> = isSelected
        ? { size: sub ? 'md' : 'xl', bold: true }
        : { size: sub ? 'xs' : 'sm' }
    return <Text {...textProps}>{text}</Text>
}

interface SecurityTypeTermControllerProps {
    type: SECURITY_TYPES_TYPE
    term: string
    onSelectType: (value: SECURITY_TYPES_TYPE) => () => void
    onSelectTerm: (value: string) => () => void
}

const SecurityTypeTermController: FC<SecurityTypeTermControllerProps> = (props) => {
    const terms = useMemo(() => {
        return SECURITY_TYPE_TERM_MAPPER[props.type] || []
    }, [props.type])

    return (
        <Box>
            <HStack alignItems="center">
                <ScrollView horizontal bounces>
                    <HStack
                        alignItems="center"
                        space="2xl"
                        paddingHorizontal="$3"
                        paddingVertical="$2">
                        {SECURITY_TYPES.map((type, index) => (
                            <Pressable key={`${type}_${index}`} onPress={props.onSelectType(type)}>
                                <TabText isSelected={props.type === type} text={type} />
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
                <MenuButton />
            </HStack>
            <Box>
                <ScrollView horizontal bounces>
                    <HStack
                        alignItems="center"
                        space="sm"
                        paddingHorizontal="$3"
                        paddingVertical="$1">
                        {terms.map((term, index) => (
                            <Pressable key={`${term}_${index}`} onPress={props.onSelectTerm(term)}>
                                <TabText isSelected={props.term === term} text={term} sub />
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
            </Box>
        </Box>
    )
}

export default SecurityTypeTermController