import { IS_SSR } from "@uplift-ltd/constants";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useUID } from "react-uid";

type ConcurrentIntervalId = string;

export type ConcurrentIntervalCallback = () => void;
type ConcurrentIntervalCallbacks = Record<ConcurrentIntervalId, ConcurrentIntervalCallback>;
export type RemoveConcurrentIntervalCallback = () => void;

export type ConcurrentIntervalDelay = number | null;
type ConcurrentIntervalDelays = Record<ConcurrentIntervalId, ConcurrentIntervalDelay>;
export type RemoveConcurrentIntervalDelay = () => void;

export type ConcurrentIntervalChannel = string;

type ConcurrentIntervalChannelCallbacks = {
  callbacks: ConcurrentIntervalCallbacks;
  callbacksOrder: ConcurrentIntervalId[];
};
type ConcurrentIntervalChannelDelays = {
  delays: ConcurrentIntervalDelays;
  delaysOrder: ConcurrentIntervalId[];
};

type ConcurrentIntervalCallbacksState = Record<
  ConcurrentIntervalChannel,
  ConcurrentIntervalChannelCallbacks
>;
type ConcurrentIntervalDelaysState = Record<
  ConcurrentIntervalChannel,
  ConcurrentIntervalChannelDelays
>;

const noopRemoveCallback: RemoveConcurrentIntervalCallback = () => {
  // do nothing
};

const noopRemoveDelay: RemoveConcurrentIntervalDelay = () => {
  // do nothing
};

const newIntervalChannelCallbacks = (): ConcurrentIntervalChannelCallbacks => ({
  callbacks: {},
  callbacksOrder: [],
});

const newIntervalChannelDelays = (
  defaultDelay: ConcurrentIntervalDelay
): ConcurrentIntervalChannelDelays => ({
  delays: { default: defaultDelay },
  delaysOrder: ["default"],
});

interface IntervalContextType {
  setCallback: (
    callback: ConcurrentIntervalCallback,
    id: ConcurrentIntervalId,
    channel?: ConcurrentIntervalChannel
  ) => RemoveConcurrentIntervalCallback;
  setDelay: (
    delay: ConcurrentIntervalDelay,
    id: ConcurrentIntervalId,
    channel?: ConcurrentIntervalChannel
  ) => RemoveConcurrentIntervalDelay;
}

const ConcurrentIntervalContext = React.createContext<IntervalContextType>({
  setCallback: () => {
    return () => {
      throw new Error("ConcurrentIntervalProvider not initialized.");
    };
  },
  setDelay: () => {
    throw new Error("ConcurrentIntervalProvider not initialized.");
  },
});

interface ConcurrentIntervalProviderProps {
  defaultDelay?: number | null;
}

export const ConcurrentIntervalProvider: React.FC<ConcurrentIntervalProviderProps> = ({
  children,
  defaultDelay = null,
}) => {
  const callbacksState = useRef<ConcurrentIntervalCallbacksState>({});
  const [delaysState, setDelaysState] = useState<ConcurrentIntervalDelaysState>({});

  const setCallback = useCallback(
    (
      callback: ConcurrentIntervalCallback,
      id: ConcurrentIntervalId,
      channel: ConcurrentIntervalChannel = "default"
    ): RemoveConcurrentIntervalCallback => {
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
      delay: ConcurrentIntervalDelay,
      id: ConcurrentIntervalId,
      channel: ConcurrentIntervalChannel = "default"
    ): RemoveConcurrentIntervalDelay => {
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
    const channels: ConcurrentIntervalChannel[] = Object.keys(delaysState);
    channels.forEach((channel) => {
      const { delays, delaysOrder } = delaysState[channel];
      const lastDelayOrder = delaysOrder[delaysOrder.length - 1];
      const lastDelay = delays[lastDelayOrder];
      if (lastDelay !== null) {
        const intervalId = setInterval(() => {
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
        clearInterval(intervalId);
      });
    };
  }, [delaysState]);

  return (
    <ConcurrentIntervalContext.Provider value={{ setCallback, setDelay }}>
      {children}
    </ConcurrentIntervalContext.Provider>
  );
};

export const useConcurrentIntervalCallback = (
  callback: ConcurrentIntervalCallback,
  channel: ConcurrentIntervalChannel = "default"
) => {
  const { setCallback } = useContext(ConcurrentIntervalContext);
  const id = useUID();

  useEffect(() => {
    const removeCallback = setCallback(callback, id, channel);
    return () => removeCallback();
  }, [callback, id, channel, setCallback]);
};

export const useConcurrentIntervalDelay = (
  delay: ConcurrentIntervalDelay,
  channel: ConcurrentIntervalChannel = "default"
) => {
  const { setDelay } = useContext(ConcurrentIntervalContext);
  const id = useUID();

  useEffect(() => {
    const removeDelay = setDelay(delay, id, channel);
    return () => removeDelay();
  }, [delay, id, channel, setDelay]);
};

export const useConcurrentInterval = (
  callback: ConcurrentIntervalCallback,
  delay: ConcurrentIntervalDelay,
  channel: ConcurrentIntervalChannel = "default"
) => {
  const { setCallback, setDelay } = useContext(ConcurrentIntervalContext);
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
