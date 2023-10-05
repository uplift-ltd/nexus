import { DebugScreens } from "./screens.js";

export type DebugNavigatorParamList = {
  [DebugScreens.DEBUG]: {
    headerShown?: boolean;
    verifyScreen?: string;
  };
  [DebugScreens.DEBUG_HOME]: undefined;
  [DebugScreens.DEBUG_INFO]: undefined;
  [DebugScreens.DEBUG_MAGIC_LOGIN]:
    | {
        verifyScreen?: string;
      }
    | undefined;
  [DebugScreens.DEBUG_PUSH_TOKEN]: undefined;
};
