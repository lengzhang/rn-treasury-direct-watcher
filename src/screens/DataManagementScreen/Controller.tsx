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

const ConfirmActionsheet: FC<
    PropsWithChildren & Pick<ComponentProps<typeof Actionsheet>, 'isOpen' | 'onClose'>
> = ({ children, isOpen, onClose }) => {
    return (
        <Actionsheet isOpen={isOpen} onClose={onClose} zIndex={999} snapPoints={[15]}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper>
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                {children}
                <ActionsheetItem onPress={onClose}>
                    <ActionsheetItemText>Cancel</ActionsheetItemText>
                </ActionsheetItem>
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
                <ActionsheetItem onPress={onPressGetAllData}>
                    <ActionsheetItemText color="$primary500">Retrieve all data</ActionsheetItemText>
                </ActionsheetItem>
            </ConfirmActionsheet>
            <ConfirmActionsheet
                isOpen={selectedButton === 'clear-all-data'}
                onClose={onChangeSelectedButton('')}>
                <ActionsheetItem onPress={onPressClearAllData}>
                    <ActionsheetItemText color="$error500">Clear all data</ActionsheetItemText>
                </ActionsheetItem>
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
