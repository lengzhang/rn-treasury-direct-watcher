import { SECURITY_TYPES } from "@/constants/TreasuryDirect";
import { SECURITY_TYPES_TYPE, Security } from "@/types/TreasuryDirect";
import { deepMerge } from "@/utils";
import {
  getAnnouncedSecurities,
  parseIssueDate,
  parsesecurityTerm,
  searchSecurities,
} from "@/utils/treasuryDirect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY_TYPES = "TD_TYPES";
const STORAGE_KEY_TERMS = "TD_TERMS";
const STORAGE_KEY_SECURITIES = "TD_SECURITIES";
const STORAGE_KEY_LAST_UPDATED_AT = "TD_LAST_UPDATED_AT";
const ONE_DAY_OFFSET = 1000 * 60 * 60 * 24;

type TermsType = Record<
  string,
  Record<
    string,
    {
      Year?: number | undefined;
      Month?: number | undefined;
      Week?: number | undefined;
      Day?: number | undefined;
      term: string;
      securities: string[];
    }
  >
>;

type SecuritiesType = Record<string, Security>;

interface State {
  initialized: boolean;
  isFetchingData: boolean;
  types: Set<string>;
  terms: TermsType;
  securities: SecuritiesType;
  lastUpdatedAt: number;
}

type Action =
  | { type: "fetchingData" | "fetchedData" }
  | {
      type: "initialized";
      storageState?: Pick<
        State,
        "types" | "terms" | "securities" | "lastUpdatedAt"
      >;
    }
  | {
      type: "merge-data" | "overwrite-data";
      types: Set<string>;
      terms: TermsType;
      securities: SecuritiesType;
    };

export const initialState: State = {
  initialized: false,
  isFetchingData: false,
  types: new Set(),
  terms: Object.create(null),
  securities: Object.create(null),
  lastUpdatedAt: 0,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "initialized":
      return {
        ...state,
        ...(action?.storageState || Object.create(null)),
        initialized: true,
      };

    case "fetchingData":
      return { ...state, isFetchingData: true };
    case "fetchedData":
      return { ...state, isFetchingData: false };

    case "merge-data":
      const newTerms: TermsType = deepMerge(
        Object.create(null),
        state.terms,
        action.terms
      );
      return {
        ...state,
        types: new Set([...state.types, ...action.types]),
        securities: deepMerge(
          Object.create(null),
          state.securities,
          action.securities
        ),
        terms: newTerms,
        lastUpdatedAt: Date.now(),
      };

    case "overwrite-data":
      return {
        ...state,
        types: action.types,
        terms: action.terms,
        securities: action.securities,
        lastUpdatedAt: Date.now(),
      };

    default:
      return state;
  }
};

const useTreasuryDirectContextProvider = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Retrieve data from storage
  useEffect(() => {
    getData();
  }, []);

  // When data is outage
  useEffect(() => {
    if (state.initialized && !state.isFetchingData) {
      if (Date.now() - state.lastUpdatedAt > ONE_DAY_OFFSET) {
        console.log("should update");
        getTreasuryDirectData();
      } else {
        console.log("should store data");
        storeData();
      }
    }
  }, [state.initialized, state.isFetchingData, state.lastUpdatedAt]);

  async function getTreasuryDirectData(shouldOverwrite: boolean = false) {
    try {
      dispatch({ type: "fetchingData" });
      console.log("start getting securities");
      const types = new Set<string>();
      const terms: TermsType = Object.create(null);
      const securityMap: SecuritiesType = Object.create(null);

      const termSet = new Set<string>();

      for (let pageNum = 0; true; pageNum++) {
        console.log("Fetching page number ", pageNum);
        const securities = await searchSecurities({
          pageNum,
          pageSize: 500,
          endIssueDate: new Date(),
        });
        console.log(`Got ${securities.length} securities.`);
        if (!securities?.length) break;

        for (const security of securities) {
          const { cusip, issueDate, type, securityTerm } = security;
          termSet.add(securityTerm);
          if (!securityTerm) break;
          types.add(type);
          if (!terms[type]) terms[type] = Object.create(null);
          if (!terms[type][securityTerm]) {
            terms[type][securityTerm] = {
              ...parsesecurityTerm(securityTerm),
              term: securityTerm,
              securities: [],
            };
          }

          const id = `${cusip}_${issueDate}`;
          terms[type][securityTerm].securities.push(id);
          securityMap[id] = { ...security };
        }
      }

      // console.log(terms["Bill"]["13-Week"].securities.join(","));

      // for (const type of types) {
      //   console.log(type);
      //   console.log(Object.keys(terms[type]));
      // }
      // console.log(termSet);
      dispatch({
        type: shouldOverwrite ? "overwrite-data" : "merge-data",
        types,
        terms,
        securities: securityMap,
      });
      console.log("Fetched treasury direct data");
    } catch (error) {
      console.error("Unable to fetch treasury direct data");
    }
    dispatch({ type: "fetchedData" });
  }

  async function storeData() {
    console.log("store data");
    try {
      const { types, terms, securities, lastUpdatedAt } = state;

      const jsonTypes = JSON.stringify([...types]);
      const jsonTerms = JSON.stringify(terms);
      const jsonSecurities = JSON.stringify(securities);

      await AsyncStorage.multiSet([
        [STORAGE_KEY_TYPES, jsonTypes],
        [STORAGE_KEY_TERMS, jsonTerms],
        [STORAGE_KEY_SECURITIES, jsonSecurities],
        [STORAGE_KEY_LAST_UPDATED_AT, lastUpdatedAt.toString()],
      ]);
      console.log("Success store data");
    } catch (error) {
      console.error("Store treasury direct data failed");
    }
  }

  async function getData() {
    let storageState:
      | Pick<State, "types" | "terms" | "securities" | "lastUpdatedAt">
      | undefined = undefined;
    try {
      const [typesPair, termsPair, securitiesPair, lastUpdatedAtPair] =
        await AsyncStorage.multiGet([
          STORAGE_KEY_TYPES,
          STORAGE_KEY_TERMS,
          STORAGE_KEY_SECURITIES,
          STORAGE_KEY_LAST_UPDATED_AT,
        ]);

      const types = typesPair[1]
        ? new Set<string>(JSON.parse(typesPair[1]))
        : initialState.types;
      const terms = termsPair[1]
        ? JSON.parse(termsPair[1])
        : initialState.terms;
      const securities = securitiesPair[1]
        ? JSON.parse(securitiesPair[1])
        : initialState.securities;
      const lastUpdatedAt =
        parseInt(lastUpdatedAtPair[1] || "") || initialState.lastUpdatedAt;

      storageState = { types, terms, securities, lastUpdatedAt };
    } catch (error) {
      console.error("Unable to get data from storage: ", error);
    }
    dispatch({ type: "initialized", storageState });
  }

  async function refetchData() {
    if (state.initialized && !state.isFetchingData) {
      await AsyncStorage.clear();
      await getTreasuryDirectData(true);
    }
  }

  return {
    ...state,
    refetchData,
  };
};

export default useTreasuryDirectContextProvider;

export const treasuryDirectContext = createContext<
  ReturnType<typeof useTreasuryDirectContextProvider>
>({ ...initialState, refetchData: async () => {} });

export const useTreasuryDirectContext = () => useContext(treasuryDirectContext);
