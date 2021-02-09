import Sentry from "@uplift-ltd/sentry";
import { reloadAsync } from "expo-updates";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorBoundaryButton, ErrorBoundaryButtonProps } from "./Button";
import { ErrorBoundaryText, ErrorBoundaryTextProps } from "./Text";

const commitId = process.env.GITHUB_SHA || "";

export interface GlobalErrorBoundaryProps {
  logo?: React.ReactNode;
  // Matches sentry extra type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sentryExtra?: { [key: string]: any };
  TextComponent?: React.FC<ErrorBoundaryTextProps>;
  ButtonComponent?: React.FC<ErrorBoundaryButtonProps>;
  renderButton?: (props: ErrorBoundaryButtonProps) => React.ReactNode;
}

export const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({
  children,
  logo,
  sentryExtra,
  TextComponent = ErrorBoundaryText,
  renderButton = ({ children: kids, style, onPress }) => (
    <ErrorBoundaryButton style={style} onPress={onPress}>
      <TextComponent>{kids as string}</TextComponent>
    </ErrorBoundaryButton>
  ),
}) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <View style={styles.root}>
          <SafeAreaView style={styles.safeArea}>
            {logo}
            <ScrollView>
              <TextComponent style={styles.message}>{error.toString()}</TextComponent>
              {renderButton({ children: "Reload", style: styles.button, onPress: reloadAsync })}
              {!!commitId && <TextComponent style={styles.commit}>{commitId}</TextComponent>}
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
      onError={(err, info) => Sentry.captureException(err, { extra: { ...info, ...sentryExtra } })}
    >
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    flex: 1,
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
  },
  logo: {
    marginBottom: 20,
  },
  message: {
    backgroundColor: "#f00f00",
    color: "#ffffff",
    padding: 20,
  },
  button: {
    marginTop: 20,
  },
  commit: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },
});
