import { useTreasuryDirectContext } from "@/contexts/TreasuryDirectContext";
import { ParamListBase } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo } from "react";

const useTreasuryDirectDataScreen = () => {
  const { isFetchingData, types, terms, refetchData } =
    useTreasuryDirectContext();
  const sortedTypes = useMemo(() => [...types].sort(), [types]);

  const sortedTerms = useMemo(() => {
    const result: Record<
      string,
      {
        term: string;
        numOfSecurities: number;
      }[]
    > = {};
    for (const type of sortedTypes) {
      result[type] = Object.values(terms[type])
        .sort((a, b) => {
          if ((a.Year || 0) !== (b.Year || 0))
            return (a.Year || 0) - (b.Year || 0);
          if ((a.Month || 0) !== (b.Month || 0))
            return (a.Month || 0) - (b.Month || 0);
          if ((a.Week || 0) !== (b.Week || 0))
            return (a.Week || 0) - (b.Week || 0);
          return (a.Day || 0) - (b.Day || 0);
        })
        .map(({ term, securities }) => ({
          term,
          numOfSecurities: securities.length,
        }));
    }
    return result;
  }, [sortedTypes, terms]);

  return { isFetchingData, sortedTypes, sortedTerms, refetchData };
};

export default useTreasuryDirectDataScreen;
