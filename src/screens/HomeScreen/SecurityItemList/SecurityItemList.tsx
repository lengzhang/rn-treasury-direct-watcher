import { Box, Button, ButtonText, Center } from '@gluestack-ui/themed'
import __ from 'ramda'
import { FC, memo, useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import SecurityItem from './SecurityItem'

import { useDataContext } from '@/contexts/DataContext'

interface SecurityItemListProps {
    ids: string[]
}

const SecurityItemList: FC<SecurityItemListProps> = ({ ids }) => {
    const { isFetching, getTreasuryDirectData } = useDataContext()

    const keyExtractor = useCallback((id: string, index: number) => `${id}_${index}`, [])

    const renderItem: ListRenderItem<string> = ({ item, index }) => {
        return (
            <>
                <SecurityItem key={item} id={item} prevId={ids[index + 1]} />
                {index === ids.length - 1 && (
                    <Center>
                        <Button
                            variant="outline"
                            marginTop="$3"
                            size="md"
                            action={isFetching ? 'secondary' : 'primary'}
                            disabled={isFetching}
                            onPress={getTreasuryDirectData}>
                            <ButtonText>Retrieve more data from Treasury Direct</ButtonText>
                        </Button>
                    </Center>
                )}
            </>
        )
    }

    return (
        <Box flex={1}>
            <FlatList
                data={ids}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                initialNumToRender={50}
                removeClippedSubviews
            />
        </Box>
    )
}

export default memo(SecurityItemList, (prevProps, nextProps) =>
    __.equals(prevProps.ids, nextProps.ids)
)
