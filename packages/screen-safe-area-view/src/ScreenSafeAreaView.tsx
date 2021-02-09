import React from "react";
import { SafeAreaView, NativeSafeAreaViewProps } from "react-native-safe-area-context";

export const ScreenSafeAreaView: React.FC<NativeSafeAreaViewProps> = ({ edges, ...props }) => (
  <SafeAreaView edges={edges || ["bottom", "left", "right"]} {...props} />
);
