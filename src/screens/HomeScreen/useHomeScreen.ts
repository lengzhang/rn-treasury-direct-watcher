import { useTDWatchersContext } from "@/contexts/TDWatchersContext";

const useHomeScreen = () => {
  const { watchers } = useTDWatchersContext();

  return { watchers };
};

export default useHomeScreen;
