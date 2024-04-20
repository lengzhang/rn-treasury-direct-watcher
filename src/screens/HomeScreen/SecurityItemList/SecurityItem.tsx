import { Text, Card, HStack, Box, Heading, useToken, Icon } from '@gluestack-ui/themed'
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react-native'
import { ComponentProps, FC, memo, useMemo } from 'react'

import { useDataContext } from '@/contexts/DataContext'

const FieldBlock: FC<
    { label: string; value?: string; color?: string } & ComponentProps<typeof Box>
> = ({ label, value, color, ...boxProps }) => {
    const textProps: ComponentProps<typeof Text> = color ? { color } : {}

    return (
        <Box {...boxProps}>
            <Heading sub>{label}</Heading>
            <Text {...textProps} numberOfLines={1} ellipsizeMode="clip">
                {value || ' '}
            </Text>
        </Box>
    )
}

interface SecurityItemProps {
    id: string
    prevId?: string
}

const SecurityItem: FC<SecurityItemProps> = ({ id, prevId }) => {
    const green = useToken('colors', 'green500')
    const red = useToken('colors', 'red500')

    const { securityMapper } = useDataContext()

    const { security, rateChange } = useMemo(() => {
        const security = securityMapper[id] || null
        const prevSecurity = prevId ? securityMapper[prevId] || null : null
        const rateChange = !security
            ? undefined
            : !prevSecurity
              ? null
              : parseFloat(security.highDiscountRate) - parseFloat(prevSecurity.highDiscountRate)

        return { security, rateChange }
    }, [securityMapper, id, prevId])

    if (!security) return null

    const announcementDate = security.auctionDate.replace(/T.+$/, '')
    const issueDate = security.issueDate.replace(/T.+$/, '')
    const price = security.pricePer100
        ? '$' + security.pricePer100.toString().replace(/0+$/, '')
        : ''
    const rate = security.highInvestmentRate
        ? security.highInvestmentRate.toString().replace(/0+$/, '') + '%'
        : ''
    const color = !rateChange ? undefined : rateChange > 0 ? green : red

    return (
        <Card
            borderWidth="$0"
            borderBottomWidth="$1"
            borderRadius="$none"
            marginHorizontal="$3"
            marginVertical="$0"
            padding="$2"
            variant="outline">
            <HStack space="sm" flexWrap="nowrap" alignItems="center">
                <Icon
                    as={
                        !rateChange ? undefined : rateChange > 0 ? TrendingUpIcon : TrendingDownIcon
                    }
                    color={color}
                    marginLeft="-$2"
                />
                <HStack flex={1} space="xs" flexWrap="wrap">
                    <HStack flex={6} space="xs" flexWrap="nowrap">
                        <FieldBlock flex={1} label="Auction date" value={announcementDate} />
                        <FieldBlock flex={1} label="Issue date" value={issueDate} />
                    </HStack>
                    <HStack flex={5} space="xs" flexWrap="nowrap">
                        <FieldBlock flex={3} label="Price" value={price} color={color} />
                        <FieldBlock flex={2} label="Rate" value={rate} color={color} />
                    </HStack>
                </HStack>
            </HStack>
        </Card>
    )
}

export default memo(SecurityItem)
