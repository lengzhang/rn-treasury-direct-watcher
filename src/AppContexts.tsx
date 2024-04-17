import { FC, ReactNode } from "react";

import { TreasuryDirectContextProvider } from "./contexts/TreasuryDirectContext";
import { NativeBaseProvider } from "native-base";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { TDWatchersContextProvider } from "./contexts/TDWatchersContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AppContexts: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <GluestackUIProvider config={config}>
          <TDWatchersContextProvider>
            <TreasuryDirectContextProvider>
              {children}
            </TreasuryDirectContextProvider>
          </TDWatchersContextProvider>
        </GluestackUIProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
};

export default AppContexts;
