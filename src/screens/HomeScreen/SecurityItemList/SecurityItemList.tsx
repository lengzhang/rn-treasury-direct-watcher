import {
    Alert,
    AlertIcon,
    Box,
    Center,
    Heading,
    HStack,
    Icon,
    RefreshControl,
    Spinner,
    Text,
    useToken,
    VStack
} from '@gluestack-ui/themed'
import { useIsFocused } from '@react-navigation/native'
import { ArrowDownIcon, ArrowRight, InfoIcon } from 'lucide-react-native'
import React, { FC, Fragment, memo, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import SecurityItem from './SecurityItem'

import FetchingOldDataAlert from '@/components/FetchingOldDataAlert'
import { useDataContext } from '@/contexts/DataContext'
import { useSettingContext } from '@/contexts/SettingContext'

const TDRefreshControl = memo(() => {
    const isFocused = useIsFocused()
    const { isFetchingLatest, oldDataPageNum, getRecentTreasuryDirectData } = useDataContext()

    const blueGray200 = useToken('colors', 'blueGray200')
    const { colorMode } = useSettingContext()
    const tintColor = colorMode === 'dark' ? blueGray200 : undefined

    if (oldDataPageNum !== -1) return null

    return (
        <RefreshControl
            refreshing={isFocused && isFetchingLatest}
            onRefresh={() => {
                getRecentTreasuryDirectData()
            }}
            tintColor={tintColor}
        />
    )
})

const PullDownNotice: FC = memo(() => {
    const { isFetchingLatest, oldDataPageNum } = useDataContext()

    if (oldDataPageNum !== -1) return null

    const text = isFetchingLatest
        ? 'Fetching latest securities ...'
        : 'Pull down to fetch latest securities'

    return (
        <HStack
            justifyContent="center"
            alignItems="center"
            space="md"
            $light-backgroundColor="$blueGray200"
            $dark-backgroundColor="$blueGray700">
            <Icon as={ArrowDownIcon} size="2xs" />
            <Heading bold sub italic>
                {text}
            </Heading>
            <Icon as={ArrowDownIcon} size="2xs" />
        </HStack>
    )
})

const NeedMoreDataNotice = memo(() => {
    return (
        <Alert margin="$5" action="info" variant="accent">
            <AlertIcon as={InfoIcon} marginRight="$3" />
            <VStack space="sm" flex={1}>
                <Text size="sm">Need more data?</Text>
                <Text size="sm">
                    Please go <Text italic>Menu</Text> <Icon as={ArrowRight} size="sm" />{' '}
                    <Text italic>Data management</Text> to retrieve more data from Treasury Direct.
                </Text>
            </VStack>
        </Alert>
    )
})

const LoadingDataNotice = memo(() => {
    return (
        <Center flex={1} height="$56">
            <Spinner size="large" />
            <Heading marginTop="$2">Loading data...</Heading>
        </Center>
    )
})

interface SecurityItemListProps {
    ids: string[]
    isLoading?: boolean
}

const SecurityItemList: FC<SecurityItemListProps> = ({ ids, isLoading }) => {
    const { securityMapper } = useDataContext()

    const keyExtractor = useCallback(
        (id: string, index: number) => `${id}_${index}_${securityMapper[id]?.pricePer100 || 0}`,
        [securityMapper]
    )

    const renderItem: ListRenderItem<string> = useCallback(
        ({ item: id, index }) => (
            <Fragment key={id + index}>
                <SecurityItem key={id} id={id} prevId={ids[index + 1]} />
            </Fragment>
        ),
        [ids]
    )

    return (
        <Box flex={1}>
            <FlatList
                data={isLoading ? [] : ids}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={50}
                removeClippedSubviews
                refreshControl={<TDRefreshControl />}
                ListHeaderComponent={<PullDownNotice />}
                ListFooterComponent={isLoading ? null : <NeedMoreDataNotice />}
                ListEmptyComponent={isLoading ? <LoadingDataNotice /> : null}
            />
            <FetchingOldDataAlert />
        </Box>
    )
}

export default memo(SecurityItemList)
