import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
  Badge,
  BadgeText,
  Box,
  Button,
  ButtonText,
  ChevronDownIcon,
  ChevronUpIcon,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed";

import useTreasuryDirectDataScreen from "./useTreasuryDirectDataScreen";

import { NavigationStackScreenProps } from "@/types";

const TreasuryDirectDataScreen: React.FC<NavigationStackScreenProps> = () => {
  const { isFetchingData, sortedTypes, sortedTerms, refetchData } =
    useTreasuryDirectDataScreen();

  if (isFetchingData)
    return (
      <VStack space="lg" flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
        <Text size="md" bold>
          Fetching data from Treasury Direct.
        </Text>
      </VStack>
    );

  return (
    <Box flex={1}>
      <Button
        variant="solid"
        margin={10}
        action="positive"
        onPress={refetchData}
      >
        <ButtonText>Refetch data</ButtonText>
      </Button>
      <ScrollView>
        <Accordion type="multiple">
          {sortedTypes.map((type) => (
            <AccordionItem key={type} value={type}>
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }) => (
                    <>
                      <AccordionTitleText>{type}</AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon as={ChevronUpIcon} />
                      ) : (
                        <AccordionIcon as={ChevronDownIcon} />
                      )}
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <HStack flexWrap="wrap" space="md">
                  {sortedTerms[type].map(({ term, numOfSecurities }) => (
                    <Badge
                      key={term}
                      variant="outline"
                      size="lg"
                      bgColor="$primary0"
                    >
                      <BadgeText>
                        {term} ({numOfSecurities})
                      </BadgeText>
                    </Badge>
                  ))}
                </HStack>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollView>
    </Box>
  );
};

export default TreasuryDirectDataScreen;
