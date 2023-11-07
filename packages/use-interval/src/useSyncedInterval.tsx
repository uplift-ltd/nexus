import { IS_SSR } from "@uplift-ltd/constants";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useUID } from "react-uid";

type SyncedIntervalId = string;

export type SyncedIntervalCallback = () => void;
type SyncedIntervalCallbacks = Record<SyncedIntervalId, SyncedIntervalCallback>;
export type RemoveSyncedIntervalCallback = () => void;

export type SyncedIntervalDelay = null | number;
type SyncedIntervalDelays = Record<SyncedIntervalId, SyncedIntervalDelay>;
export type RemoveSyncedIntervalDelay = () => void;

export type SyncedIntervalChannel = string;

type SyncedIntervalChannelCallbacks = {
  callbacks: SyncedIntervalCallbacks;
  callbacksOrder: SyncedIntervalId[];
};
type SyncedIntervalChannelDelays = {
  delays: SyncedIntervalDelays;
  delaysOrder: SyncedIntervalId[];
};

type SyncedIntervalCallbacksState = Record<SyncedIntervalChannel, SyncedIntervalChannelCallbacks>;
type SyncedIntervalDelaysState = Record<SyncedIntervalChannel, SyncedIntervalChannelDelays>;

const noopRemoveCallback: RemoveSyncedIntervalCallback = () => {
  // do nothing
};

const noopRemoveDelay: RemoveSyncedIntervalDelay = () => {
  // do nothing
};

const newIntervalChannelCallbacks = (): SyncedIntervalChannelCallbacks => ({
  callbacks: {},
  callbacksOrder: [],
});

const newIntervalChannelDelays = (
  defaultDelay: SyncedIntervalDelay
): SyncedIntervalChannelDelays => ({
  delays: { default: defaultDelay },
  delaysOrder: ["default"],
});

interface IntervalContextType {
  setCallback: (
    callback: SyncedIntervalCallback,
    id: SyncedIntervalId,
    channel?: SyncedIntervalChannel
  ) => RemoveSyncedIntervalCallback;
  setDelay: (
    delay: SyncedIntervalDelay,
    id: SyncedIntervalId,
    channel?: SyncedIntervalChannel
  ) => RemoveSyncedIntervalDelay;
}

const SyncedIntervalContext = React.createContext<IntervalContextType>({
  setCallback: () => {
    return () => {
      throw new Error("SyncedIntervalProvider not initialized.");
    };
  },
  setDelay: () => {
    throw new Error("SyncedIntervalProvider not initialized.");
  },
});

interface SyncedIntervalProviderProps {
  children: React.ReactNode | React.ReactNode[];
  defaultDelay?: null | number;
}

export function SyncedIntervalProvider({
  children,
  defaultDelay = null,
}: SyncedIntervalProviderProps) {
  const callbacksState = useRef<SyncedIntervalCallbacksState>({});
  const [delaysState, setDelaysState] = useState<SyncedIntervalDelaysState>({});

  const setCallback = useCallback(
    (
      callback: SyncedIntervalCallback,
      id: SyncedIntervalId,
      channel: SyncedIntervalChannel = "default"
    ): RemoveSyncedIntervalCallback => {
      if (IS_SSR) {
        return noopRemoveCallback;
      }
      if (!callbacksState.current[channel]) {
        callbacksState.current[channel] = newIntervalChannelCallbacks();
      }
      callbacksState.current[channel].callbacks[id] = callback;
      callbacksState.current[channel].callbacksOrder.push(id);
      return () => {
        delete callbacksState.current[channel].callbacks[id];
        callbacksState.current[channel].callbacksOrder = callbacksState.current[
          channel
        ].callbacksOrder.filter((currentId) => currentId !== id);
      };
    },
    []
  );

  const setDelay = useCallback(
    (
      delay: SyncedIntervalDelay,
      id: SyncedIntervalId,
      channel: SyncedIntervalChannel = "default"
    ): RemoveSyncedIntervalDelay => {
      if (IS_SSR) {
        return noopRemoveDelay;
      }
      setDelaysState((existingDelays) => {
        const existingChannelDelays =
          existingDelays[channel] || newIntervalChannelDelays(defaultDelay);
        return {
          ...existingDelays,
          [channel]: {
            ...existingChannelDelays,
            delays: {
              ...existingChannelDelays.delays,
              [id]: delay,
            },
            delaysOrder: [...existingChannelDelays.delaysOrder, id],
          },
        };
      });
      return () => {
        setDelaysState((existingDelays) => {
          const existingChannelDelays = existingDelays[channel];
          const newDelays = { ...existingChannelDelays.delays };
          delete newDelays[id];
          return {
            ...existingDelays,
            [channel]: {
              ...existingChannelDelays,
              delays: newDelays,
              delaysOrder: existingChannelDelays.delaysOrder.filter(
                (delayOrder) => delayOrder !== id
              ),
            },
          };
        });
      };
    },
    [defaultDelay]
  );

  useEffect(() => {
    const intervalIds: number[] = [];
    const channels: SyncedIntervalChannel[] = Object.keys(delaysState);
    channels.forEach((channel) => {
      const { delays, delaysOrder } = delaysState[channel];
      const lastDelayOrder = delaysOrder[delaysOrder.length - 1];
      const lastDelay = delays[lastDelayOrder];
      if (lastDelay !== null) {
        const intervalId = window.setInterval(() => {
          callbacksState.current[channel].callbacksOrder.forEach((callbackId) => {
            const callback = callbacksState.current[channel].callbacks[callbackId];
            callback();
          });
        }, lastDelay);
        intervalIds.push(intervalId);
      }
    });
    return () => {
      intervalIds.forEach((intervalId) => {
        window.clearInterval(intervalId);
      });
    };
  }, [delaysState]);

  const contextValue = useMemo(() => {
    return { setCallback, setDelay };
  }, [setCallback, setDelay]);

  return (
    <SyncedIntervalContext.Provider value={contextValue}>{children}</SyncedIntervalContext.Provider>
  );
}

export const useSyncedIntervalCallback = (
  callback: SyncedIntervalCallback,
  channel: SyncedIntervalChannel = "default"
) => {
  const { setCallback } = useContext(SyncedIntervalContext);
  const id = useUID();

  useEffect(() => {
    const removeCallback = setCallback(callback, id, channel);
    return () => removeCallback();
  }, [callback, id, channel, setCallback]);
};

export const useSyncedIntervalDelay = (
  delay: SyncedIntervalDelay,
  channel: SyncedIntervalChannel = "default"
) => {
  const { setDelay } = useContext(SyncedIntervalContext);
  const id = useUID();

  useEffect(() => {
    const removeDelay = setDelay(delay, id, channel);
    return () => removeDelay();
  }, [delay, id, channel, setDelay]);
};

export const useSyncedInterval = (
  callback: SyncedIntervalCallback,
  delay: SyncedIntervalDelay,
  channel: SyncedIntervalChannel = "default"
) => {
  const { setCallback, setDelay } = useContext(SyncedIntervalContext);
  const id = useUID();

  useEffect(() => {
    const removeCallback = setCallback(callback, id, channel);
    return () => {
      removeCallback();
    };
  }, [callback, id, channel, setCallback]);

  useEffect(() => {
    const removeDelay = setDelay(delay, id, channel);
    return () => {
      removeDelay();
    };
  }, [delay, id, channel, setDelay]);
};
