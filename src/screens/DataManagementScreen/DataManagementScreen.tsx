import {
    Box,
    Button,
    ButtonText,
    Divider,
    Heading,
    HStack,
    Icon,
    InfoIcon,
    ScrollView,
    Text,
    VStack
} from '@gluestack-ui/themed'
import __ from 'ramda'
import { useMemo } from 'react'

import { SECURITY_TYPES } from '@/constants/treasuryDirect'
import { useDataContext } from '@/contexts/DataContext'

const DataManagementScreen = () => {
    const { securityTypeTermMapper, clearAllData } = useDataContext()

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

    const items = SECURITY_TYPES.reduce<string[]>((acc, type, index) => {
        if (index > 0) acc.push('DIVIDER')
        acc.push(type)
        return acc
    }, [])

    return (
        <ScrollView
            padding="$5"
            flex={1}
            $light-backgroundColor="$white"
            $dark-backgroundColor="$backgroundDark900">
            <VStack space="md">
                {items.map((type, index) => {
                    if (type === 'DIVIDER') return <Divider key={`${type}_${index}`} />

                    return (
                        <HStack key={`${type}_${index}`}>
                            <Heading flex={1}>{type}</Heading>
                            <Heading flex={3} textAlign="right">
                                {securityCountsMapper[type]}
                            </Heading>
                            <Heading flex={3} marginLeft="$2">
                                securities
                            </Heading>
                        </HStack>
                    )
                })}
            </VStack>
            <Box marginTop="$5">
                <Button variant="solid" onPress={clearAllData}>
                    <ButtonText>Clear all data</ButtonText>
                </Button>
                <HStack justifyContent="center" alignItems="center" marginTop="$1">
                    <Icon as={InfoIcon} size="xs" marginRight="$1" color="$warning500" />
                    <Text sub italic bold color="$warning500">
                        Recent data will be retrieved after clearing.
                    </Text>
                </HStack>
            </Box>
        </ScrollView>
    )
}

export default DataManagementScreen
