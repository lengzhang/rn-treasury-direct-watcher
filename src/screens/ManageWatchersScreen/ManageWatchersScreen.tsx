import { ParamListBase } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import useManageWatchersScreen from "./useManageWatchersScreen";

import AddWatcherModal from "./AddWatcherModal";
import {
  Box,
  Button,
  ButtonIcon,
  ButtonText,
  Card,
  HStack,
  Heading,
  Icon,
  Text,
} from "@gluestack-ui/themed";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Swipeable } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";
import { Watcher } from "@/contexts/TDWatchersContext";
import { useCallback } from "react";
import { ChevronLeft, CircleXIcon } from "lucide-react-native";

const ManageWatchersScreen: React.FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const {
    watchers,
    isAddWatcherModalOpen,
    handleAddWatcherModalOpen,
    onAddWatcher,
    deleteWatcher,
    updateWatchers,
  } = useManageWatchersScreen();

  const renderDraggableItem = useCallback(
    ({ drag, isActive, item: { type, term } }: RenderItemParams<Watcher>) => {
      const renderRightActions = () => {
        return (
          <Card size="sm" variant="elevated" marginBottom="$3" padding={0}>
            <Button
              variant="solid"
              action="negative"
              flex={1}
              size="xs"
              onPress={() => {
                deleteWatcher({ type, term });
              }}
            >
              <ButtonIcon as={CircleXIcon} size="xl" />
            </Button>
          </Card>
        );
      };

      return (
        <ScaleDecorator>
          <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity
              activeOpacity={1}
              onLongPress={drag}
              disabled={isActive}
            >
              <Card size="sm" variant="elevated" marginBottom="$3">
                <HStack justifyContent="space-between" alignItems="center">
                  <Box>
                    <Heading width="100%">{type}</Heading>
                    <Text>{term}</Text>
                  </Box>
                  <Icon as={ChevronLeft} size="xl" />
                </HStack>
              </Card>
            </TouchableOpacity>
          </Swipeable>
        </ScaleDecorator>
      );
    },
    []
  );

  return (
    <Box flex={1}>
      <Button
        variant="solid"
        margin={10}
        action="positive"
        onPress={handleAddWatcherModalOpen(true)}
      >
        <ButtonText>Add watcher</ButtonText>
      </Button>
      <DraggableFlatList
        style={{ height: "100%", paddingHorizontal: 10 }}
        data={watchers}
        keyExtractor={(watcher) => `${watcher.type}_${watcher.term}`}
        renderItem={renderDraggableItem}
        onDragEnd={({ data }) => {
          updateWatchers(data);
        }}
        activationDistance={20}
      />
      <AddWatcherModal
        isOpen={isAddWatcherModalOpen}
        onClose={handleAddWatcherModalOpen(false)}
        onAddWatcher={onAddWatcher}
      />
    </Box>
  );
};

export default ManageWatchersScreen;
