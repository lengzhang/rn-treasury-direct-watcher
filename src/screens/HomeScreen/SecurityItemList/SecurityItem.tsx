import { Text, Card, HStack, Box, Heading, useToken, Icon } from '@gluestack-ui/themed'
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react-native'
import { FC, memo, useMemo } from 'react'

import { useDataContext } from '@/contexts/DataContext'

const FieldBlock: FC<{ label: string; value?: string; color?: string }> = ({
    label,
    value,
    color
}) => {
    return (
        <Box>
            <Heading sub>{label}</Heading>
            <Text color={color}>{value || ' '}</Text>
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

    const announcementDate = security.announcementDate.replace(/T.+$/, '')
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
            <HStack space="sm" flexWrap="wrap" alignItems="center">
                <Icon
                    as={
                        !rateChange ? undefined : rateChange > 0 ? TrendingUpIcon : TrendingDownIcon
                    }
                    color={color}
                />
                <FieldBlock label="Auction date" value={announcementDate} />
                <FieldBlock label="Issue date" value={issueDate} />
                <FieldBlock label="Price" value={price} color={color} />
                <FieldBlock label="Rate" value={rate} color={color} />
            </HStack>
        </Card>
    )
}

export default memo(SecurityItem)
