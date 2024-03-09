import { FC, ReactNode } from "react";
import { TreasuryDirectContextProvider } from "./contexts/TreasuryDirectContext";

const AppContexts: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TreasuryDirectContextProvider>{children}</TreasuryDirectContextProvider>
  );
};

export default AppContexts;
