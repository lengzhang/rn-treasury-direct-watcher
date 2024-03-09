import SettingScreen from "@/screens/SettingScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";

const Stack = createNativeStackNavigator();

const SettingRouter = () => {
  return (
    <Stack.Navigator initialRouteName="Setting">
      <Stack.Screen name="Setting_" component={SettingScreen} />
      <Stack.Screen
        name="Manage watchers"
        component={SettingScreen}
        options={{
          navigationBarHidden: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingRouter;
