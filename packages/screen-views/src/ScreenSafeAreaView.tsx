import React from "react";
import { SafeAreaView, NativeSafeAreaViewProps } from "react-native-safe-area-context";
import { SCREEN_EDGES } from "./constants";

export type ScreenSafeAreaViewProps = NativeSafeAreaViewProps;

export const ScreenSafeAreaView: React.FC<ScreenSafeAreaViewProps> = ({
  edges = SCREEN_EDGES,
  ...props
}) => <SafeAreaView edges={edges} {...props} />;
