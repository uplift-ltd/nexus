import { Text, TextProps } from "react-native";

export const ErrorBoundaryText = Text;

export interface ErrorBoundaryTextProps {
  children: string;
  style?: TextProps["style"];
}
