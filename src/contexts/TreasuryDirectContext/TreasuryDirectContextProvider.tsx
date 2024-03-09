import { FC, ReactNode } from "react";
import useTreasuryDirectContextProvider, {
  treasuryDirectContext,
} from "./useTreasuryDirectContextProvider";

const TreasuryDirectContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = useTreasuryDirectContextProvider();
  return (
    <treasuryDirectContext.Provider value={value}>
      {children}
    </treasuryDirectContext.Provider>
  );
};

export default TreasuryDirectContextProvider;
