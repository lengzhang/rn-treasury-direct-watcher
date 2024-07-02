import { HStack, useToken, Icon } from '@gluestack-ui/themed'
import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react-native'
import { FC, memo } from 'react'

import SecurityFieldBlock from '@/components/SecurityFieldBlock'
import { Security } from '@/types/treasuryDirect'
const getSecurityRate = (security: Security) => {
    switch (security.type) {
        case 'Bill':
        case 'CMB':
            return security.highInvestmentRate
        case 'Note':
        case 'Bond':
        case 'TIPS':
            return security.interestRate
        case 'FRN':
            return security.spread
        default:
            return ''
    }
}

const getSecurityInfo = (security: Security) => {
    const rate = getSecurityRate(security)
    return {
        announcementDate: security.auctionDate.replace(/T.+$/, ''),
        issueDate: security.issueDate.replace(/T.+$/, ''),
        maturityDate: security.maturityDate.replace(/T.+$/, ''),
        price: security.pricePer100
            ? '$' + security.pricePer100.toString().replace(/0+$/, '').replace(/\.+$/, '')
            : '------',
        discountMargin: security.highDiscountMargin
            ? security.highDiscountMargin.toString().replace(/0+$/, '').replace(/\.+$/, '') + '%'
            : '------',
        rate: rate ? rate.toString().replace(/0+$/, '').replace(/\.+$/, '') + '%' : '------'
    }
}

interface SecurityItemBlockProps {
    security: Security
    prevSecurity?: Security | null
}

const SecurityItemBlock: FC<SecurityItemBlockProps> = ({ security, prevSecurity }) => {
    const green = useToken('colors', 'green500')
    const red = useToken('colors', 'red500')

    const { issueDate, maturityDate, price, discountMargin, rate } = getSecurityInfo(security)

    const priceDiff =
        security.pricePer100 && prevSecurity?.pricePer100
            ? parseFloat(prevSecurity.pricePer100) - parseFloat(security.pricePer100)
            : null

    const color = !priceDiff ? undefined : priceDiff > 0 ? green : red

    const icon: LucideIcon | undefined = !priceDiff
        ? undefined
        : priceDiff > 0
          ? TrendingUpIcon
          : TrendingDownIcon

    return (
        <HStack space="sm" flexWrap="nowrap" alignItems="center">
            <Icon as={icon} color={color} />
            <HStack flex={1} space="xs" flexWrap="wrap">
                <HStack flex={6} space="xs" flexWrap="nowrap">
                    <SecurityFieldBlock flex={1} label="Issue date" value={issueDate} />
                    <SecurityFieldBlock flex={1} label="Maturity date" value={maturityDate} />
                </HStack>
                <HStack flex={5} space="xs" flexWrap="nowrap">
                    {security.type === 'FRN' ? (
                        <SecurityFieldBlock
                            flex={3}
                            label="Margin"
                            value={discountMargin}
                            color={color}
                        />
                    ) : (
                        <SecurityFieldBlock flex={3} label="Price" value={price} color={color} />
                    )}
                    <SecurityFieldBlock
                        flex={2}
                        label={security.type === 'FRN' ? 'Spread' : 'Rate'}
                        value={rate}
                        color={color}
                    />
                </HStack>
            </HStack>
        </HStack>
    )
}

export default memo(SecurityItemBlock)
