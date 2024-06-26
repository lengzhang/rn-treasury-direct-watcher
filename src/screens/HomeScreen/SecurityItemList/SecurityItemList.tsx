import {
    Box,
    Heading,
    HStack,
    Icon,
    RefreshControl,
    VStack,
    Text,
    Alert,
    AlertIcon,
    useToken
} from '@gluestack-ui/themed'
import { useIsFocused } from '@react-navigation/native'
import { ArrowDownIcon, ArrowRight, InfoIcon } from 'lucide-react-native'
import __ from 'ramda'
import React, { FC, Fragment, memo, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import SecurityItem from './SecurityItem'

import { useDataContext } from '@/contexts/DataContext'
import { useSettingContext } from '@/contexts/SettingContext'

const TDRefreshControl = memo(() => {
    const isFocused = useIsFocused()
    const { isFetchingLatest, getRecentTreasuryDirectData } = useDataContext()

    const blueGray200 = useToken('colors', 'blueGray200')
    const { colorMode } = useSettingContext()
    const tintColor = colorMode === 'dark' ? blueGray200 : undefined

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

const PullDownNotice: FC<{ text: string }> = memo(({ text }) => {
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

interface SecurityItemListProps {
    ids: string[]
}

const SecurityItemList: FC<SecurityItemListProps> = ({ ids }) => {
    const { isFetchingLatest } = useDataContext()

    const keyExtractor = useCallback((id: string, index: number) => `${id}_${index}`, [])

    const headerText = isFetchingLatest
        ? 'Fetching latest securities ...'
        : 'Pull down to fetch latest securities'

    const renderItem: ListRenderItem<string> = useCallback(
        ({ item, index }) => (
            <Fragment key={item + index}>
                {index === 0 && <PullDownNotice text={headerText} />}
                <SecurityItem key={item} id={item} prevId={ids[index + 1]} />
                {index === ids.length - 1 && <NeedMoreDataNotice />}
            </Fragment>
        ),
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
                refreshControl={<TDRefreshControl />}
            />
        </Box>
    )
}

export default memo(SecurityItemList, (prevProps, nextProps) =>
    __.equals(prevProps.ids, nextProps.ids)
)
