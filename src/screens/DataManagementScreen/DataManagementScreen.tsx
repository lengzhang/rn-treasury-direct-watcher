import { Divider, Heading, HStack, ScrollView, VStack } from '@gluestack-ui/themed'
import __ from 'ramda'
import { Fragment, useMemo } from 'react'

import Controller from './Controller'

import { SECURITY_TYPES } from '@/constants/treasuryDirect'
import { useDataContext } from '@/contexts/DataContext'

const DataManagementScreen = () => {
    const { securityTypeTermMapper } = useDataContext()

    const securityCountsMapper = useMemo(
        () =>
            SECURITY_TYPES.reduce<Record<string, number>>((acc, type) => {
                acc[type] = __.values(securityTypeTermMapper[type]).reduce((sum, obj) => {
                    return sum + obj.securities.length
                }, 0)
                return acc
            }, {}),
        [securityTypeTermMapper]
    )

    const dataList = useMemo(
        () => (
            <VStack
                paddingTop="$5"
                space="md"
                $light-backgroundColor="$white"
                $dark-backgroundColor="$backgroundDark900">
                {SECURITY_TYPES.map((type, index) => (
                    <Fragment key={`${type}_${index}`}>
                        <HStack paddingHorizontal="$3">
                            <Heading flex={1} size="sm">
                                {type}
                            </Heading>
                            <Heading flex={3} size="sm" textAlign="right">
                                {securityCountsMapper[type]}
                            </Heading>
                            <Heading flex={3} size="sm" marginLeft="$2">
                                securities
                            </Heading>
                        </HStack>
                        <Divider key={`${type}_${index}`} />
                    </Fragment>
                ))}
            </VStack>
        ),
        [securityCountsMapper]
    )

    return (
        <ScrollView flex={1}>
            <VStack space="2xl">
                {dataList}
                <Controller />
            </VStack>
        </ScrollView>
    )
}

export default DataManagementScreen
