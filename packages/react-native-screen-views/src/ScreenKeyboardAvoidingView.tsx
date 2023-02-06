import { useHeaderHeight } from "@react-navigation/stack";
import React from "react";
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform } from "react-native";

interface ScreenKeyboardAvoidingViewProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode | React.ReactNode[];
  iosBehavior?: KeyboardAvoidingViewProps["behavior"];
  androidBehavior?: KeyboardAvoidingViewProps["behavior"];
}

export function ScreenKeyboardAvoidingView({
  style = { flex: 1 },
  children,
  iosBehavior = "padding",
  androidBehavior = "height",
  ...props
}: ScreenKeyboardAvoidingViewProps) {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={style}
      keyboardVerticalOffset={headerHeight}
      behavior={Platform.OS === "ios" ? iosBehavior : androidBehavior}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
