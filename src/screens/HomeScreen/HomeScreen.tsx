import { Button, ButtonText, Center, Icon, Text } from "@gluestack-ui/themed";
import {
  ParamListBase,
  StackActions,
  TabActions,
  useRoute,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InfoIcon } from "lucide-react-native";
import React, { FC } from "react";
import PagerView from "react-native-pager-view";

import useHomeScreen from "./useHomeScreen";
import HomeScreenSecuritiesView from "./HomeScreenSecuritiesView";
import { Watcher } from "@/contexts/TDWatchersContext";

const HomeScreenView: FC<{ watchers: Watcher[] }> = ({ watchers }) => {
  return (
    <PagerView initialPage={0} style={{ flex: 1 }}>
      {watchers.map(({ type, term }, index) => (
        <HomeScreenSecuritiesView
          index={index}
          key={`${type}_${term}_${index}`}
          length={watchers.length}
          term={term}
          type={type}
        />
      ))}
    </PagerView>
  );
};

const HomeScreen: React.FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const { watchers } = useHomeScreen();

  const toManageWatchers = () => {
    navigation.dispatch(TabActions.jumpTo("Setting"));
    navigation.dispatch(StackActions.push("Manage watchers"));
  };
  if (!watchers.length)
    return (
      <Center flex={1} paddingHorizontal="$10">
        <Icon as={InfoIcon} color="$info500" marginBottom="$3" size="xl" />
        <Text bold marginBottom={0} textAlign="center">
          You don't have any watchers, please add watchers in
        </Text>
        <Button variant="link" onPress={toManageWatchers}>
          <ButtonText bold>{"Setting -> Manage watchers"}</ButtonText>
        </Button>
      </Center>
    );

  return <HomeScreenView watchers={watchers} />;

  // return (
  //   <PagerView initialPage={0} style={{ flex: 1 }}>
  //     {watchers.map(({ type, term }, index) => (
  //       <HomeScreenSecuritiesView
  //         index={index}
  //         key={`${type}_${term}_${index}`}
  //         length={watchers.length}
  //         term={term}
  //         type={type}
  //       />
  //     ))}
  //   </PagerView>
  // );
};

export default HomeScreen;
