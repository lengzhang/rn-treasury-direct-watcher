import { FC, ReactNode } from "react";
import useTDWatchersContextProvider, {
  tdWatchersContext,
} from "./useTDWatchersContextProvider";

const TDWatchersContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = useTDWatchersContextProvider();
  return (
    <tdWatchersContext.Provider value={value}>
      {children}
    </tdWatchersContext.Provider>
  );
};

export default TDWatchersContextProvider;
