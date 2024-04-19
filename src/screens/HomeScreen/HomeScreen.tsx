import {
    Card,
    Center,
    Divider,
    Modal,
    ModalBackdrop,
    SafeAreaView,
    Spinner,
    Text
} from '@gluestack-ui/themed'

import SecurityItem from './SecurityItemList'
import SecurityTypeTermController from './SecurityTypeTermController'
import useHomeScreen from './useHomeScreen'

const HomeScreen = () => {
    const { initialized, type, term, securityIds, isFetching, onSelectType, onSelectTerm } =
        useHomeScreen()

    return (
        <SafeAreaView
            flex={1}
            $light-backgroundColor="$white"
            $dark-backgroundColor="$backgroundDark900">
            {initialized ? (
                <>
                    <SecurityTypeTermController
                        type={type}
                        term={term}
                        onSelectType={onSelectType}
                        onSelectTerm={onSelectTerm}
                    />
                    <Divider />
                    <SecurityItem ids={securityIds} />
                    <Modal isOpen={isFetching}>
                        <ModalBackdrop />
                        <Card>
                            <Center>
                                <Spinner />
                                <Text marginTop="$1" size="md">
                                    Retrieving all data from TreasuryDirect...
                                </Text>
                                <Text size="xs" color="$warning500" italic>
                                    This process will take some time. Please be patient.
                                </Text>
                            </Center>
                        </Card>
                    </Modal>
                </>
            ) : (
                <Center flex={1}>
                    <Spinner size="small" />
                </Center>
            )}
        </SafeAreaView>
    )
}

export default HomeScreen
