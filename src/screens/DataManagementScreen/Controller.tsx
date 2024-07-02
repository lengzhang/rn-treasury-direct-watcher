import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    Card,
    Divider,
    HStack,
    Icon,
    InfoIcon,
    Text,
    View
} from '@gluestack-ui/themed'
import { FC, memo, useState } from 'react'
import { Pressable, PressableProps } from 'react-native'

import { useDataContext } from '@/contexts/DataContext'

interface ControllerPressableProps extends Pick<PressableProps, 'onPress' | 'disabled'> {
    text: string
}

const ControllerPressable: FC<ControllerPressableProps> = ({ onPress, disabled, text }) => {
    return (
        <Pressable onPress={onPress} disabled={disabled}>
            {({ pressed }) => (
                <View
                    $dark-backgroundColor={pressed ? '$backgroundDark800' : '$backgroundDark900'}
                    $light-backgroundColor={pressed ? '$backgroundLight50' : '$backgroundLight0'}
                    padding="$2">
                    <Text color={disabled ? '$secondary500' : '$primary500'} fontWeight="$medium">
                        {text}
                    </Text>
                </View>
            )}
        </Pressable>
    )
}

const Controller = () => {
    const [isOpen, setIsOpen] = useState(false)

    const { oldDataPageNum, refreshAllData } = useDataContext()

    const onOpen = () => {
        setIsOpen(true)
    }

    const onClose = () => {
        setIsOpen(false)
    }

    const onRefreshAllData = async () => {
        onClose()
        await refreshAllData()
    }

    return (
        <>
            <Card marginHorizontal="$2" marginTop="$10" padding="$1">
                <ControllerPressable
                    text="Refresh all data"
                    onPress={onOpen}
                    disabled={oldDataPageNum !== -1}
                />
            </Card>
            <Actionsheet isOpen={isOpen} onClose={onClose} zIndex={999}>
                <ActionsheetBackdrop />
                <ActionsheetContent paddingBottom="$5">
                    <ActionsheetDragIndicatorWrapper>
                        <ActionsheetDragIndicator />
                    </ActionsheetDragIndicatorWrapper>

                    <HStack justifyContent="flex-start" alignItems="flex-start" marginTop="$1">
                        <Icon
                            as={InfoIcon}
                            size="xs"
                            marginTop="$0.5"
                            marginRight="$1"
                            color="$warning400"
                        />
                        <Text sub italic bold color="$warning400">
                            This action will erase all current data and retrieve all information
                            again from Treasury Direct.
                        </Text>
                    </HStack>
                    <Divider marginTop="$2" />
                    <ActionsheetItem justifyContent="center" onPress={onRefreshAllData}>
                        <ActionsheetItemText size="xl" fontWeight="$medium" color="$primary500">
                            Refresh all data
                        </ActionsheetItemText>
                    </ActionsheetItem>
                    <ActionsheetItem justifyContent="center" onPress={onClose}>
                        <ActionsheetItemText size="xl" fontWeight="$medium">
                            Cancel
                        </ActionsheetItemText>
                    </ActionsheetItem>
                </ActionsheetContent>
            </Actionsheet>
        </>
    )
}

export default memo(Controller)
