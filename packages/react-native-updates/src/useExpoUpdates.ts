import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

export function useExpoUpdates() {
  const [canUpdate, setCanUpdate] = useState<boolean | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (__DEV__) {
        return;
      }
      const update = await Updates.checkForUpdateAsync();
      setCanUpdate(update.isAvailable);
    };
    run();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (__DEV__) {
        return;
      }
      if (canUpdate) {
        setUpdateLoading(true);
        const { isNew } = await Updates.fetchUpdateAsync();
        setUpdateLoading(false);
        setUpdateReady(isNew);
      } else {
        setUpdateLoading(false);
        setUpdateReady(false);
      }
    };
    run();
  }, [canUpdate]);

  useEffect(() => {
    const listener = ({ type }: Updates.UpdateEvent) => {
      if (type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        setCanUpdate(true);
      } else if (type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
        setCanUpdate(false);
      }
    };
    const subscription = Updates.addListener(listener);
    return () => subscription.remove();
  }, []);

  return {
    canUpdate,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
    reloadAsync: Updates.reloadAsync,
    updateId: Updates.updateId,
    updateLoading,
    updateReady,
  };
}
