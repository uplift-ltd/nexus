import { GITHUB_SHA, GRAPHQL_HOST } from "@uplift-ltd/constants";
import Constants from "expo-constants";
import { makeUrl } from "expo-linking";
import { releaseChannel, reloadAsync } from "expo-updates";
import React from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import { Button, InfoItem } from "./common";

export const Info: React.FC = () => {
  return (
    <>
      <InfoItem label="Commit" value={GITHUB_SHA} />
      <InfoItem label="GQL Host" value={GRAPHQL_HOST} />
      <InfoItem
        label="Identifier"
        value={
          Platform.OS === "ios"
            ? Constants.manifest.ios?.bundleIdentifier
            : Constants.manifest.android?.package
        }
      />
      <InfoItem label="Release Channel" value={releaseChannel} />
      <InfoItem label="Slug" value={Constants.manifest.slug} />
      <InfoItem label="Linking Prefix" value={makeUrl("/")} />
      <InfoItem
        label="Expo / Native Version (Build Version)"
        value={`${Constants.expoVersion} / ${Constants.nativeAppVersion} (${Constants.nativeBuildVersion})`}
      />
      <InfoItem label="Installation ID" value={Constants.installationId} />
      {Constants.deviceId !== Constants.installationId && (
        <InfoItem label="Installation ID" value={Constants.deviceId} />
      )}
      <InfoItem label="Session ID" value={Constants.sessionId} />
      <Button
        style={styles.reload}
        onPress={async () => {
          try {
            await reloadAsync();
          } catch (err) {
            Alert.alert(err.message);
          }
        }}
      >
        Reload
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  reload: {
    marginTop: 20,
  },
});
