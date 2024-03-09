import { ParamListBase } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View, Text, Button } from "react-native";

const SettingScreen: React.FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Setting Screen</Text>
      <Button
        title="Got to home"
        onPress={() => navigation.navigate("Manage watchers")}
      />
    </View>
  );
};

export default SettingScreen;
