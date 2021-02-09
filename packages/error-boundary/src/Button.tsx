import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

export interface ErrorBoundaryButtonProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress: () => void;
}

export const ErrorBoundaryButton: React.FC<ErrorBoundaryButtonProps> = ({
  children,
  style,
  onPress,
}) => (
  <TouchableOpacity style={style} onPress={onPress}>
    {children}
  </TouchableOpacity>
);
