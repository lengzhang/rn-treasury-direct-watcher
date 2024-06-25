import { Center, Divider, SafeAreaView, Spinner } from '@gluestack-ui/themed'
import { FC } from 'react'

import SecurityItem from './SecurityItemList'
import SecurityTypeTermController from './SecurityTypeTermController'
import useHomeScreen from './useHomeScreen'

import { HomeScreenComponentType } from '@/Router'

const HomeScreen: FC<HomeScreenComponentType> = () => {
    const { initialized, type, term, securityIds, onSelectType, onSelectTerm } = useHomeScreen()

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
