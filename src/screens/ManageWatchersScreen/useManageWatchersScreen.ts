import { useTDWatchersContext } from "@/contexts/TDWatchersContext";
import { useState } from "react";

const useManageWatchersScreen = () => {
  const { watchers, addWatcher, deleteWatcher, updateWatchers } =
    useTDWatchersContext();

  const [isAddWatcherModalOpen, setIsAddWatcherModalOpen] = useState(false);

  const handleAddWatcherModalOpen = (value: boolean) => () => {
    setIsAddWatcherModalOpen(value);
  };

  const onAddWatcher = (type: string, term: string) => {
    if (!type || !term) return;
    console.log("add: ", type, term);
    setIsAddWatcherModalOpen(false);
    addWatcher({ type, term });
  };

  return {
    watchers,
    isAddWatcherModalOpen,
    handleAddWatcherModalOpen,
    onAddWatcher,
    deleteWatcher,
    updateWatchers,
  };
};

export default useManageWatchersScreen;
