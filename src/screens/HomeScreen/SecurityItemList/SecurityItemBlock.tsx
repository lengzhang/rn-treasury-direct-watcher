import { HStack, useToken, Icon } from '@gluestack-ui/themed'
import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react-native'
import { FC, memo } from 'react'

import SecurityFieldBlock from '@/components/SecurityFieldBlock'
import { Security } from '@/types/treasuryDirect'

const getSecurityInfo = (security: Security) => {
    return {
        announcementDate: security.auctionDate.replace(/T.+$/, ''),
        issueDate: security.issueDate.replace(/T.+$/, ''),
        maturityDate: security.maturityDate.replace(/T.+$/, ''),
        price: security.pricePer100
            ? '$' + security.pricePer100.toString().replace(/0+$/, '').replace(/\.+$/, '')
            : '------',
        discountMargin: security.highDiscountMargin
            ? security.highDiscountMargin.toString().replace(/0+$/, '').replace(/\.+$/, '') + '%'
            : '------'
    }
}
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

interface SecurityItemBlockProps {
    security: Security
    prevSecurity?: Security | null
}

const SecurityItemBlock: FC<SecurityItemBlockProps> = ({ security, prevSecurity }) => {
    const green = useToken('colors', 'green500')
    const red = useToken('colors', 'red500')

    const { issueDate, maturityDate, price, discountMargin } = getSecurityInfo(security)

    const rate = getSecurityRate(security)
    const prevRate = prevSecurity ? getSecurityRate(prevSecurity) : null

    const rateChange = rate && prevRate ? parseFloat(rate) - parseFloat(prevRate) : null

    const color = !rateChange ? undefined : rateChange > 0 ? green : red

    const icon: LucideIcon | undefined = !rateChange
        ? undefined
        : rateChange > 0
          ? TrendingUpIcon
          : TrendingDownIcon

    const rateText = rate ? rate.toString().replace(/0+$/, '').replace(/\.+$/, '') + '%' : '------'

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
                        value={rateText}
                        color={color}
                    />
                </HStack>
            </HStack>
        </HStack>
    )
}

export default memo(SecurityItemBlock)
