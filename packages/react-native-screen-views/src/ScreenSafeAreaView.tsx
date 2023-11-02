import React from "react";
import { NativeSafeAreaViewProps, SafeAreaView } from "react-native-safe-area-context";

import { SCREEN_EDGES } from "./constants.js";

export type ScreenSafeAreaViewProps = NativeSafeAreaViewProps;

export function ScreenSafeAreaView({ edges = SCREEN_EDGES, ...props }: ScreenSafeAreaViewProps) {
  return <SafeAreaView edges={edges} {...props} />;
}
