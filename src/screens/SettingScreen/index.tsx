import { FC } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useToken } from "@gluestack-style/react";
import {
  Divider,
  HStack,
  Heading,
  Pressable,
  VStack,
} from "@gluestack-ui/themed";

import { NavigationStackScreenProps, PressableProps } from "@/types";

const SETTING_ROUTES: string[] = ["Manage watchers", "Treasury direct data"];

const SettingItem: FC<
  Pick<NavigationStackScreenProps, "navigation"> & {
    routeName: string;
    title: string;
  }
> = ({ navigation, routeName, title }) => {
  const primary200 = useToken("colors", "primary200");
  const primary500 = useToken("colors", "primary500");

  const onPress = () => {
    navigation.navigate(routeName);
  };

  return (
    <>
      <Pressable onPress={onPress} paddingHorizontal={10} paddingVertical={10}>
        {({ pressed, hovered }: PressableProps) => {
          return (
            <HStack justifyContent="space-between" alignItems="center">
              <Heading
                size="lg"
                color={pressed || hovered ? "$primary200" : "$primary500"}
              >
                {title}
              </Heading>
              <AntDesign
                name="right"
                size={20}
                color={pressed || hovered ? primary200 : primary500}
              />
            </HStack>
          );
        }}
      </Pressable>
      <Divider />
    </>
  );
};

const SettingScreen: React.FC<NavigationStackScreenProps> = ({
  navigation,
}) => {
  return (
    <VStack backgroundColor="$white">
      <Divider />
      {SETTING_ROUTES.map((name) => (
        <SettingItem
          key={name}
          navigation={navigation}
          routeName={name}
          title={name}
        />
      ))}
    </VStack>
  );
};

export default SettingScreen;
