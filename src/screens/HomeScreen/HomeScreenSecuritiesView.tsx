import { Watcher } from "@/contexts/TDWatchersContext";
import { useTreasuryDirectContext } from "@/contexts/TreasuryDirectContext";
import { Security } from "@/types/TreasuryDirect";
import { parseDate } from "@/utils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Box,
  Card,
  ChevronLeftIcon,
  ChevronRightIcon,
  HStack,
  Heading,
  Icon,
  InfoIcon,
  SafeAreaView,
  ScrollView,
  Text,
  VStack,
  useToken,
} from "@gluestack-ui/themed";
import { FC, memo, useMemo } from "react";
import { FlatList } from "react-native";

interface HomeScreenSecuritiesViewProps {
  term: string;
  type: string;
  index: number;
  length: number;
}

const HomeScreenSecurity: FC<{
  cusip: string;
  issueDate: string;
  maturityDate: string;
  price: string;
  rate: string;
  prevRate: string;
}> = memo(({ cusip, issueDate, maturityDate, price, rate, prevRate }) => {
  const green400 = useToken("colors", "green400");
  const red400 = useToken("colors", "red400");
  const blue400 = useToken("colors", "blue400");
  const sizeMD = useToken("fontSizes", "md");

  const rateChange = parseFloat(rate) - parseFloat(prevRate);

  return (
    <Card size="sm" variant="elevated">
      <HStack space="xs">
        <VStack space="xs">
          <Text size="md" bold>
            Issue date:
          </Text>
          <Text size="md" bold>
            Maturity date:
          </Text>
          <Text size="md" bold>
            Price:
          </Text>
          <Text size="md" bold>
            Investment rate:
          </Text>
          <Text size="md" bold>
            Rate change:
          </Text>
        </VStack>
        <VStack space="xs">
          <Text size="md">{issueDate}</Text>
          <Text size="md">{maturityDate}</Text>
          <Text size="md">${price}</Text>
          <Text size="md">{parseFloat(rate).toFixed(3)}%</Text>
          <Text>
            {rateChange.toFixed(3)}%{" "}
            <MaterialCommunityIcons
              name={
                rateChange > 0
                  ? "elevation-rise"
                  : rateChange < 0
                  ? "elevation-decline"
                  : "equal"
              }
              size={sizeMD}
              color={
                rateChange > 0 ? green400 : rateChange < 0 ? red400 : blue400
              }
            />
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
});

const HomeScreenSecuritiesViewHeader: FC<HomeScreenSecuritiesViewProps> = ({
  term,
  type,
  index,
  length,
}) => {
  return (
    <Box>
      <HStack
        alignItems="flex-end"
        paddingHorizontal="$3"
        justifyContent="space-between"
      >
        <Heading size="2xl">{type}</Heading>
        <Heading size="lg">{term}</Heading>
      </HStack>
      <HStack height="$1">
        {Array.from({ length }).map((_, i) => (
          <Box
            key={`${index}_${i}`}
            backgroundColor={index === i ? "$primary200" : "$blueGray200"}
            flex={1}
          />
        ))}
      </HStack>
    </Box>
  );
};

const HomeScreenSecuritiesView: FC<HomeScreenSecuritiesViewProps> = ({
  term,
  type,
  index,
  length,
}) => {
  const { terms, securities } = useTreasuryDirectContext();

  const securityIDs = useMemo(
    () =>
      terms?.[type]?.[term]?.securities?.sort((a, b) => {
        const dateA = new Date(a.split("_")[1]);
        const dataB = new Date(b.split("_")[1]);
        return dataB.getTime() - dateA.getTime();
      }) || [],
    [type, term, terms]
  );

  if (!securityIDs.length) return null;

  return (
    <SafeAreaView>
      <HomeScreenSecuritiesViewHeader
        term={term}
        type={type}
        index={index}
        length={length}
      />
      {type && term && (
        <Box paddingHorizontal="$2">
          <FlatList
            data={securityIDs}
            keyExtractor={(securityID, index) => `${securityID}_${index}`}
            renderItem={({ item: securityID, index }) => {
              const security = securities[securityID];
              const {
                cusip,
                issueDate,
                maturityDate,
                pricePer100: price,
                highInvestmentRate: rate,
              } = security;
              const prevRate =
                securities?.[securityIDs?.[index + 1]]?.highInvestmentRate ||
                "";
              return (
                <Box key={securityID} marginTop="$3">
                  <HomeScreenSecurity
                    cusip={cusip}
                    issueDate={parseDate(new Date(issueDate))}
                    maturityDate={parseDate(new Date(maturityDate))}
                    price={price}
                    rate={rate}
                    prevRate={prevRate}
                  />
                </Box>
              );
            }}
          />
        </Box>
      )}
    </SafeAreaView>
  );
};

export default HomeScreenSecuritiesView;
