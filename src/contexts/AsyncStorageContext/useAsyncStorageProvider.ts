import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useReducer, createContext, useContext } from "react";

interface State {
  initialized: boolean;
}

type Action = { type: "initialized" };

export const initialState: State = {
  initialized: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "initialized":
      return { ...state, initialized: true };
    default:
      return state;
  }
};

const ITEM_KEY = "state";

const useAsyncStorageProvider = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getData();
    return () => {
      storeData();
    };
  }, []);

  async function storeData() {
    try {
      const stateStr = JSON.stringify(state);
      await AsyncStorage.setItem(ITEM_KEY, stateStr);
    } catch (error) {
      console.error("Store data failed");
    }
  }

  async function getData() {
    try {
      const jsonValue = (await AsyncStorage.getItem(ITEM_KEY)) || "";
      const stateObj = JSON.parse(jsonValue) || null;
      console.log(`Got state object: ${stateObj}`);
      dispatch({ type: "initialized" });
    } catch (error) {
      console.error("Unable to get data from storage");
    }
  }

  return state;
};

export const asyncStorageContext = createContext<
  ReturnType<typeof useAsyncStorageProvider>
>({ ...initialState });

export const useAsyncStorageContext = () => useContext(asyncStorageContext);

export default useAsyncStorageProvider;
