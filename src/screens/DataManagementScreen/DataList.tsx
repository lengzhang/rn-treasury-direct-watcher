import {
    Accordion,
    AccordionContent,
    AccordionContentText,
    AccordionHeader,
    AccordionIcon,
    AccordionItem,
    AccordionTitleText,
    AccordionTrigger,
    ChevronDownIcon,
    ChevronUpIcon,
    Divider,
    HStack,
    VStack
} from '@gluestack-ui/themed'
import R from 'ramda'
import { useMemo } from 'react'

import { SECURITY_TYPES } from '@/constants/treasuryDirect'
import { useDataContext } from '@/contexts/DataContext'
import { numAddComma } from '@/utils'

const DataList = () => {
    const { securityTypeTermMapper } = useDataContext()

    const securityCountsMapper = useMemo(
        () =>
            SECURITY_TYPES.reduce<Record<string, number>>((acc, type) => {
                acc[type] = R.values(securityTypeTermMapper[type]).reduce((sum, obj) => {
                    return sum + obj.securities.length
                }, 0)
                return acc
            }, {}),
        [securityTypeTermMapper]
    )

    return (
        <Accordion type="multiple">
            {SECURITY_TYPES.map((type) => (
                <AccordionItem key={type} value={type}>
                    <AccordionHeader>
                        <AccordionTrigger>
                            {({ isExpanded }) => (
                                <HStack>
                                    <AccordionTitleText>{type}</AccordionTitleText>
                                    <AccordionTitleText textAlign="right">
                                        {numAddComma(securityCountsMapper?.[type] || 0)} securities
                                    </AccordionTitleText>
                                    <AccordionIcon
                                        as={isExpanded ? ChevronUpIcon : ChevronDownIcon}
                                        ml="$3"
                                    />
                                </HStack>
                            )}
                        </AccordionTrigger>
                        <Divider />
                    </AccordionHeader>
                    <AccordionContent>
                        <VStack space="lg">
                            {Object.keys(securityTypeTermMapper?.[type] || [])
                                .sort()
                                .map((term) => (
                                    <HStack key={term}>
                                        <AccordionContentText>{term}</AccordionContentText>
                                        <AccordionContentText flex={1} textAlign="right">
                                            {numAddComma(
                                                securityTypeTermMapper[type][term]?.securities
                                                    ?.length
                                            ) || 0}
                                        </AccordionContentText>
                                        <AccordionContentText marginLeft="$2">
                                            securities
                                        </AccordionContentText>
                                    </HStack>
                                ))}
                        </VStack>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export default DataList
