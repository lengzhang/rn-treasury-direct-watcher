import { ParamListBase } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { View, Text, Button } from "react-native";

const HomeScreen: React.FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button
        title="Got to setting"
        onPress={() => navigation.navigate("Setting")}
      />
    </View>
  );
};

export default HomeScreen;
