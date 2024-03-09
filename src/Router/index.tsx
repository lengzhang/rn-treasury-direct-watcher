import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AntDesign } from "@expo/vector-icons";
import SettingRouter from "./SettingRouter";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Router = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: "Treasury Direct Watcher",
            tabBarIcon: ({ color, size }) => {
              return <AntDesign name="home" size={size} color={color} />;
            },
          }}
        />
        <Tab.Screen
          name="Setting"
          component={SettingRouter}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              return <AntDesign name="setting" size={size} color={color} />;
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Router;
