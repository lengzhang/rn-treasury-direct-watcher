import {
    Box,
    Button,
    ButtonText,
    Center,
    Heading,
    HStack,
    Icon,
    RefreshControl
} from '@gluestack-ui/themed'
import { ArrowDownIcon } from 'lucide-react-native'
import __ from 'ramda'
import { FC, memo, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import SecurityItem from './SecurityItem'

import { useDataContext } from '@/contexts/DataContext'

const TDRefeshControl = memo(() => {
    const { isFetchingLatest, getRecentTreasuryDirectData } = useDataContext()

    return (
        <RefreshControl
            refreshing={isFetchingLatest}
            onRefresh={() => {
                getRecentTreasuryDirectData()
            }}
        />
    )
})

interface SecurityItemListProps {
    ids: string[]
}

const SecurityItemList: FC<SecurityItemListProps> = ({ ids }) => {
    const { isFetchingLatest, isFetchingAll, getTreasuryDirectData } = useDataContext()

    const keyExtractor = useCallback((id: string, index: number) => `${id}_${index}`, [])

    const headerText = isFetchingLatest
        ? 'Fetching latest securities ...'
        : 'Pull down to fetch latest securities'

    const renderItem: ListRenderItem<string> = useCallback(
        ({ item, index }) => {
            return (
                <>
                    {index === 0 && (
                        <HStack
                            justifyContent="center"
                            alignItems="center"
                            space="md"
                            $light-backgroundColor="$blueGray200"
                            $dark-backgroundColor="$blueGray700">
                            <Icon as={ArrowDownIcon} size="2xs" />
                            <Heading bold sub italic>
                                {headerText}
                            </Heading>
                            <Icon as={ArrowDownIcon} size="2xs" />
                        </HStack>
                    )}
                    <SecurityItem key={item} id={item} prevId={ids[index + 1]} />
                    {index === ids.length - 1 && (
                        <Center>
                            <Button
                                variant="outline"
                                marginTop="$3"
                                size="md"
                                action={isFetchingAll ? 'secondary' : 'primary'}
                                disabled={isFetchingAll}
                                onPress={getTreasuryDirectData}>
                                <ButtonText>Retrieve more data from Treasury Direct</ButtonText>
                            </Button>
                        </Center>
                    )}
                </>
            )
        },
        [ids, headerText]
    )

    return (
        <Box flex={1}>
            <FlatList
                data={ids}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={50}
                removeClippedSubviews
                refreshControl={<TDRefeshControl />}
            />
        </Box>
    )
}

export default memo(SecurityItemList, (prevProps, nextProps) =>
    __.equals(prevProps.ids, nextProps.ids)
)
