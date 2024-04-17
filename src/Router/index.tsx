import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ManageWatchersScreen from "@/screens/ManageWatchersScreen";
import TreasuryDirectDataScreen from "@/screens/TreasuryDirectDataScreen";
import { useToken } from "@gluestack-style/react";

import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { Center, Icon, Spinner, Text } from "@gluestack-ui/themed";
import { HomeIcon, SettingsIcon } from "lucide-react-native";
import { useTDWatchersContext } from "@/contexts/TDWatchersContext";
import { useTreasuryDirectContext } from "@/contexts/TreasuryDirectContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const InitializeLoading = () => {
  return (
    <Center flex={1}>
      <Spinner size="large" />
      <Text bold marginTop="$3">
        Loading application...
      </Text>
    </Center>
  );
};

const TabsRouter = () => {
  const primary500 = useToken("colors", "primary500");

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: primary500,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerTitle: "Treasury Direct Watcher",
          tabBarIcon: ({ color }) => (
            <Icon as={HomeIcon} size="xl" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon as={SettingsIcon} size="xl" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Router = () => {
  const primary500 = useToken("colors", "primary500");
  const tdWatchersContext = useTDWatchersContext();
  const treasuryDirectContext = useTreasuryDirectContext();

  if (!tdWatchersContext.initialized || !treasuryDirectContext.initialized) {
    return <InitializeLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TabsRouter"
        screenOptions={{
          headerBackTitleVisible: false,
          headerTintColor: primary500,
          headerTitleStyle: { color: "black" },
          headerBackButtonMenuEnabled: false,
        }}
      >
        <Stack.Screen
          name="TabsRouter"
          component={TabsRouter}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Manage watchers" component={ManageWatchersScreen} />
        <Stack.Screen
          name="Treasury direct data"
          component={TreasuryDirectDataScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Router;
