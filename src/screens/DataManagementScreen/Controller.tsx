import {
    Actionsheet,
    ActionsheetBackdrop,
    ActionsheetContent,
    ActionsheetDragIndicator,
    ActionsheetDragIndicatorWrapper,
    ActionsheetItem,
    ActionsheetItemText,
    Alert,
    AlertIcon,
    Card,
    Divider,
    HStack,
    Icon,
    InfoIcon,
    Modal,
    ModalBackdrop,
    Spinner,
    Text,
    View,
    VStack
} from '@gluestack-ui/themed'
import { ComponentProps, FC, memo, PropsWithChildren, useState } from 'react'
import { Pressable, PressableProps } from 'react-native'

import { useDataContext } from '@/contexts/DataContext'

interface ControllerPressableProps extends Pick<PressableProps, 'onPress'> {
    text: string
}

const ControllerPressable: FC<ControllerPressableProps> = ({ onPress, text }) => {
    return (
        <Pressable onPress={onPress}>
            {({ pressed }) => (
                <View
                    $dark-backgroundColor={pressed ? '$backgroundDark800' : '$backgroundDark900'}
                    $light-backgroundColor={pressed ? '$backgroundLight50' : '$backgroundLight0'}
                    padding="$2">
                    <Text color="$primary500" fontWeight="$medium">
                        {text}
                    </Text>
                </View>
            )}
        </Pressable>
    )
}

const ConfirmActionsheetItem: FC<
    PropsWithChildren &
        ComponentProps<typeof ActionsheetItem> &
        Pick<ComponentProps<typeof ActionsheetItemText>, 'color'>
> = ({ children, color, ...props }) => {
    return (
        <ActionsheetItem justifyContent="center" {...props}>
            <ActionsheetItemText color={color} size="xl" fontWeight="$medium">
                {children}
            </ActionsheetItemText>
        </ActionsheetItem>
    )
}

const ConfirmActionsheet: FC<
    PropsWithChildren & Pick<ComponentProps<typeof Actionsheet>, 'isOpen' | 'onClose'>
> = ({ children, isOpen, onClose }) => {
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose} zIndex={999}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {children}
                <ConfirmActionsheetItem onPress={onClose} marginBottom="$5">
                    Cancel
                </ConfirmActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    )
}

const Controller = () => {
    const [selectedButton, setSelectedButton] = useState<
        'retrieve-all-data' | 'clear-all-data' | ''
    >('')

    const {
        isFetchingLatest,
        isFetchingAll,
        getRecentTreasuryDirectData,
        getTreasuryDirectData,
        clearAllData
    } = useDataContext()

    const onChangeSelectedButton = (type: 'retrieve-all-data' | 'clear-all-data' | '') => () => {
        setSelectedButton(type)
    }

    const onPressGetLatestData = async () => {
        await getRecentTreasuryDirectData()
    }

    const onPressGetAllData = async () => {
        onChangeSelectedButton('')()
        await getTreasuryDirectData()
    }

    const onPressClearAllData = async () => {
        onChangeSelectedButton('')()
        await clearAllData()
    }

    return (
        <>
            <Card marginHorizontal="$2" padding="$2">
                <ControllerPressable text="Retrieve latest data" onPress={onPressGetLatestData} />
                <Divider />
                <ControllerPressable
                    text="Retrieve all data"
                    onPress={onChangeSelectedButton('retrieve-all-data')}
                />
                <Divider />
                <ControllerPressable
                    text="Clear all data"
                    onPress={onChangeSelectedButton('clear-all-data')}
                />
                <HStack justifyContent="flex-start" alignItems="center" marginTop="$1">
                    <Icon as={InfoIcon} size="xs" marginRight="$1" color="$warning500" />
                    <Text sub italic bold color="$warning500">
                        Recent data will be retrieved after clearing.
                    </Text>
                </HStack>
            </Card>
            <ConfirmActionsheet
                isOpen={selectedButton === 'retrieve-all-data'}
                onClose={onChangeSelectedButton('')}>
                <ConfirmActionsheetItem onPress={onPressGetAllData} color="$primary500">
                    Retrieve all data
                </ConfirmActionsheetItem>
            </ConfirmActionsheet>
            <ConfirmActionsheet
                isOpen={selectedButton === 'clear-all-data'}
                onClose={onChangeSelectedButton('')}>
                <ConfirmActionsheetItem onPress={onPressClearAllData} color="$error500">
                    Clear all data
                </ConfirmActionsheetItem>
            </ConfirmActionsheet>
            {(isFetchingLatest || isFetchingAll) && (
                <Modal isOpen>
                    <ModalBackdrop />
                    <Alert action="info" variant="accent">
                        <AlertIcon as={Spinner} marginRight="$3" />
                        <VStack space="xs">
                            <Text>Retrieving data from TreasuryDirect...</Text>
                            <Text>This process may take some time.</Text>
                            <Text>Please be patient.</Text>
                        </VStack>
                    </Alert>
                </Modal>
            )}
        </>
    )
}

export default memo(Controller)
