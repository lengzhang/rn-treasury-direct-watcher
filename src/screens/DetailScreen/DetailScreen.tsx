import {
    Button,
    ButtonIcon,
    ButtonText,
    Card,
    Divider,
    Heading,
    HStack,
    ScrollView,
    VStack
} from '@gluestack-ui/themed'
import * as Linking from 'expo-linking'
import { ExternalLinkIcon, FileWarningIcon } from 'lucide-react-native'
import { ComponentProps, FC, PropsWithChildren, useEffect, useMemo } from 'react'

import { DetailScreenComponentType } from '@/Router'
import SecurityFieldBlock from '@/components/SecurityFieldBlock'
import { useDataContext } from '@/contexts/DataContext'
import { Security } from '@/types/treasuryDirect'

const RATE_BLOCK_LABELS = ['High', 'Average/Median', 'Low']
const PDF_KEYS: (
    | 'pdfFilenameAnnouncement'
    | 'pdfFilenameCompetitiveResults'
    | 'pdfFilenameNoncompetitiveResults'
    | 'pdfFilenameSpecialAnnouncement'
)[] = [
    'pdfFilenameAnnouncement',
    'pdfFilenameCompetitiveResults',
    'pdfFilenameNoncompetitiveResults',
    'pdfFilenameSpecialAnnouncement'
]

const securityFieldBlockCommonProps: Partial<ComponentProps<typeof SecurityFieldBlock>> = {
    disableSub: true,
    headerProps: {
        size: 'sm'
    }
}

const CardContainer: FC<PropsWithChildren & { header: string }> = ({ children, header }) => {
    return (
        <Card borderRadius="$none" padding="$2">
            <Heading size="xl">{header}</Heading>
            <Divider width="110%" marginLeft="-$2" />
            {children}
        </Card>
    )
}

const SecurityRate: FC<{ security: Security }> = ({ security }) => {
    const type = security.type
    const label =
        type === 'Bill' || type === 'CMB'
            ? 'Investment rate'
            : type === 'Note' || type === 'Bond' || type === 'TIPS'
              ? 'Interest rate'
              : 'Spread'

    const rate =
        type === 'Bill' || type === 'CMB'
            ? security.highInvestmentRate
            : type === 'Note' || type === 'Bond' || type === 'TIPS'
              ? security.interestRate
              : security.spread

    return (
        <SecurityFieldBlock
            flexBasis="$48"
            {...securityFieldBlockCommonProps}
            label={label}
            value={rate ? rate.replace(/0+$/, '').replace(/\.+$/, '') + '%' : '------'}
        />
    )
}

const DetailScreen: FC<DetailScreenComponentType> = ({ navigation, route }) => {
    const { id } = route.params
    const { securityMapper } = useDataContext()

    const security = useMemo(() => securityMapper[id], [id, securityMapper])
    const type = security.type

    useEffect(() => {
        navigation.setOptions({
            headerTitle: security.cusip
        })
    }, [security])

    const openPDFLink = (key: string) => () => {
        Linking.openURL(
            `https://www.treasurydirect.gov/instit/annceresult/press/preanre/${security.auctionDateYear}/${key}`
        )
    }

    const dates = [
        { label: 'Announcement date', value: security.announcementDate },
        { label: 'Auction date', value: security.auctionDate },
        { label: 'Issue date', value: security.issueDate },
        { label: 'Maturity date', value: security.maturityDate }
    ]

    const discountRates = [
        security.highDiscountRate,
        security.averageMedianDiscountRate,
        security.lowDiscountRate
    ]

    const discountMargins = [
        security.highDiscountMargin,
        security.averageMedianDiscountMargin,
        security.lowDiscountMargin
    ]

    const yields = [security.highYield, security.averageMedianYield, security.lowYield]

    return (
        <ScrollView flex={1}>
            <VStack space="lg" marginTop="$3" marginBottom="$24">
                <CardContainer header="Information">
                    <HStack space="md" flexWrap="wrap">
                        <SecurityFieldBlock
                            flexBasis="$48"
                            {...securityFieldBlockCommonProps}
                            label="Security type"
                            value={security.securityType}
                        />
                        <SecurityFieldBlock
                            flexBasis="$48"
                            {...securityFieldBlockCommonProps}
                            label="Security term"
                            value={security.securityTerm}
                        />
                        <SecurityFieldBlock
                            flexBasis="$48"
                            {...securityFieldBlockCommonProps}
                            label="Price per $100"
                            value={
                                security.pricePer100
                                    ? '$' +
                                      security.pricePer100.replace(/0+$/, '').replace(/\.+$/, '')
                                    : '------'
                            }
                        />
                        {type === 'FRN' && (
                            <SecurityFieldBlock
                                flexBasis="$48"
                                {...securityFieldBlockCommonProps}
                                label="Discount margin"
                                value={
                                    security.highDiscountMargin
                                        ? security.highDiscountMargin
                                              .replace(/0+$/, '')
                                              .replace(/\.+$/, '') + '%'
                                        : '------'
                                }
                            />
                        )}
                        {type === 'TIPS' && (
                            <SecurityFieldBlock
                                flexBasis="$48"
                                {...securityFieldBlockCommonProps}
                                label="High Yield"
                                value={
                                    security.highYield
                                        ? security.highYield
                                              .replace(/0+$/, '')
                                              .replace(/\.+$/, '') + '%'
                                        : '------'
                                }
                            />
                        )}
                        <SecurityRate security={security} />
                        <SecurityFieldBlock
                            minWidth="$full"
                            {...securityFieldBlockCommonProps}
                            label="Minimum Bid Amount and Multiples"
                            value={security.minimumBidAmount}
                        />
                    </HStack>
                </CardContainer>
                <CardContainer header="Dates">
                    <HStack space="md" flexWrap="wrap">
                        {dates.map(({ label, value }) => (
                            <SecurityFieldBlock
                                key={label}
                                flexBasis="$48"
                                {...securityFieldBlockCommonProps}
                                label={label}
                                value={value.replace(/T.+$/, '')}
                            />
                        ))}
                    </HStack>
                </CardContainer>
                {type === 'Bill' && (
                    <CardContainer header="Discount rate">
                        <HStack space="4xl" flexWrap="wrap">
                            {discountRates.map((value, index) => {
                                const label = RATE_BLOCK_LABELS[index]
                                return (
                                    <SecurityFieldBlock
                                        {...securityFieldBlockCommonProps}
                                        key={label}
                                        label={label}
                                        value={value ? value.replace(/0+$/, '') + '%' : '------'}
                                    />
                                )
                            })}
                        </HStack>
                    </CardContainer>
                )}
                {type === 'FRN' && (
                    <CardContainer header="Discount margin">
                        <HStack space="4xl" flexWrap="wrap">
                            {discountMargins.map((value, index) => {
                                const label = RATE_BLOCK_LABELS[index]
                                return (
                                    <SecurityFieldBlock
                                        {...securityFieldBlockCommonProps}
                                        key={label}
                                        label={label}
                                        value={value ? value.replace(/0+$/, '') + '%' : '------'}
                                    />
                                )
                            })}
                        </HStack>
                    </CardContainer>
                )}
                {(type === 'Note' || type === 'Bond' || type === 'TIPS') && (
                    <CardContainer header="Yield">
                        <HStack space="4xl" flexWrap="wrap">
                            {yields.map((value, index) => {
                                const label = RATE_BLOCK_LABELS[index]
                                return (
                                    <SecurityFieldBlock
                                        {...securityFieldBlockCommonProps}
                                        key={label}
                                        label={label}
                                        value={value ? value.replace(/0+$/, '') + '%' : '------'}
                                    />
                                )
                            })}
                        </HStack>
                    </CardContainer>
                )}
                <CardContainer header="PDFs">
                    <VStack
                        space="xs"
                        alignSelf="flex-start"
                        alignItems="flex-start"
                        marginLeft="$3">
                        {PDF_KEYS.map((pdfKey) => {
                            const label = pdfKey
                                .replace(/pdfFilename/, '')
                                .replace(/([A-Z])/g, ' $1')
                                .trim()
                            const filename = security[pdfKey] || ''
                            return (
                                <Button
                                    key={pdfKey}
                                    variant="link"
                                    onPress={openPDFLink(filename)}
                                    disabled={!filename}
                                    action={filename ? 'primary' : 'secondary'}>
                                    <ButtonIcon
                                        as={filename ? ExternalLinkIcon : FileWarningIcon}
                                        marginRight="$2"
                                    />
                                    <ButtonText strikeThrough={!filename}>{label}</ButtonText>
                                </Button>
                            )
                        })}
                    </VStack>
                </CardContainer>
            </VStack>
        </ScrollView>
    )
}

export default DetailScreen
