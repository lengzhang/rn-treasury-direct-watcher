import { Card } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { FC, memo, useCallback, useMemo } from 'react'
import { Pressable } from 'react-native'

import SecurityItemBlockA from './SecurityItemBlock'

import { StackNavigation } from '@/Router'
import { useDataContext } from '@/contexts/DataContext'

interface SecurityItemProps {
    id: string
    prevId?: string
}

const SecurityItem: FC<SecurityItemProps> = ({ id, prevId }) => {
    const navigation = useNavigation<StackNavigation>()
    const { securityMapper } = useDataContext()

    const { security, prevSecurity } = useMemo(() => {
        return {
            security: securityMapper[id] || null,
            prevSecurity: prevId ? securityMapper[prevId] || null : null
        }
    }, [])

    const onPressItem = useCallback(() => {
        navigation.navigate('Detail', { id })
    }, [])

    if (!security) return null

    return (
        <Pressable onPress={onPressItem}>
            {({ pressed }) => (
                <Card
                    borderWidth="$0"
                    borderBottomWidth="$1"
                    borderRadius="$none"
                    margin="$0"
                    padding="$2"
                    variant="outline"
                    $light-backgroundColor={pressed ? '$backgroundLight50' : undefined}
                    $dark-backgroundColor={pressed ? '$backgroundDark800' : undefined}>
                    <SecurityItemBlockA security={security} prevSecurity={prevSecurity} />
                </Card>
            )}
        </Pressable>
    )
}

export default memo(SecurityItem)
