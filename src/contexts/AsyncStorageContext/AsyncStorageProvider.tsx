import { FC, ReactNode } from "react";
import useAsyncStorageProvider, {
  asyncStorageContext,
} from "./useAsyncStorageProvider";

const AsyncStorageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const value = useAsyncStorageProvider();
  return (
    <asyncStorageContext.Provider value={value}>
      {children}
    </asyncStorageContext.Provider>
  );
};

export default AsyncStorageProvider;
