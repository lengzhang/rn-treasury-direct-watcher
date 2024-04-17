import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";
import { createContext, useContext, useEffect, useReducer } from "react";
import { Action, State, Watcher } from "./types";

const STORAGE_KEY_WATCHERS = "TD_WATCHERS";

const initialState: State = {
  initialized: false,
  watchers: [],
};

const reducer = (state: State, action: Action): State => {
  let foundIndex = -1;
  switch (action.type) {
    case "initialized":
      return {
        ...state,
        initialized: true,
        watchers: action.watchers || initialState.watchers,
      };

    case "add-watcher":
      foundIndex = _.findIndex(
        state.watchers,
        (watcher) =>
          watcher.type === action.watcher.type &&
          watcher.term === action.watcher.term
      );
      if (foundIndex !== -1) return state;
      return {
        ...state,
        watchers: _.cloneDeep([...state.watchers, action.watcher]),
      };

    case "delete-watcher":
      return {
        ...state,
        watchers: _.filter(state.watchers, (watcher) => {
          return !_.isEqual(watcher, action.watcher);
        }),
      };

    case "update-watches":
      return { ...state, watchers: _.cloneDeep(action.watchers) };

    default:
      return state;
  }
};

const useTDWatchersContextProvider = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    restoreState();
  }, []);

  useEffect(() => {
    persistWatchers();
  }, [state.watchers]);

  async function restoreState() {
    let watchers: Watcher[] = initialState.watchers;
    try {
      const watchersStr = await AsyncStorage.getItem(STORAGE_KEY_WATCHERS);
      if (!!watchersStr) watchers = JSON.parse(watchersStr);
    } catch (error) {
      console.error("Unable to retrieve data from storage: ", error);
    }
    dispatch({ type: "initialized", watchers });
  }

  async function persistWatchers() {
    try {
      const jsonStr = JSON.stringify(state.watchers);
      await AsyncStorage.setItem(STORAGE_KEY_WATCHERS, jsonStr);
      const str = await AsyncStorage.getItem(STORAGE_KEY_WATCHERS);
      console.log("Success store watchers");
    } catch (error) {
      console.error("Unable to store data to storage: ", error);
    }
  }

  function addWatcher(watcher: Watcher) {
    dispatch({ type: "add-watcher", watcher });
  }

  function deleteWatcher(watcher: Watcher) {
    dispatch({ type: "delete-watcher", watcher });
  }

  function updateWatchers(watchers: Watcher[]) {
    dispatch({ type: "update-watches", watchers });
  }

  return { ...state, addWatcher, deleteWatcher, updateWatchers };
};

export default useTDWatchersContextProvider;

export const tdWatchersContext = createContext<
  ReturnType<typeof useTDWatchersContextProvider>
>({
  ...initialState,
  addWatcher: () => {},
  deleteWatcher: () => {},
  updateWatchers: () => {},
});

export const useTDWatchersContext = () => useContext(tdWatchersContext);
