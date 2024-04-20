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
import { FC } from 'react'

import SecurityItem from './SecurityItemList'
import SecurityTypeTermController from './SecurityTypeTermController'
import useHomeScreen from './useHomeScreen'

import { HomeScreenComponentType } from '@/Router'

const HomeScreen: FC<HomeScreenComponentType> = () => {
    const { initialized, type, term, securityIds, isFetchingAll, onSelectType, onSelectTerm } =
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
                    <Modal isOpen={isFetchingAll}>
                        <ModalBackdrop />
                        <Card>
                            <Center>
                                <Spinner />
                                <Text marginTop="$1" size="md">
                                    Retrieving data from TreasuryDirect...
                                </Text>
                                <Text size="xs" color="$warning500" italic>
                                    This process may take some time. Please be patient.
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
