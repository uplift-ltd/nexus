import { StackScreenProps } from "@react-navigation/stack";
import { GITHUB_RUN_NUMBER, GITHUB_SHA, GRAPHQL_HOST } from "@uplift-ltd/constants";
import Constants from "expo-constants";
import { createURL } from "expo-linking";
import { fetchUpdateAsync, releaseChannel, reloadAsync, updateId } from "expo-updates";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Button, InfoItem } from "./common.js";
import { DebugScreens } from "./screens.js";
import { DebugNavigatorParamList } from "./types.js";

export type InfoProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG_MAGIC_LOGIN>;

export function Info(_props: InfoProps) {
  return (
    <>
      <InfoItem label="Commit" value={GITHUB_SHA} />
      <InfoItem
        label="Versions"
        value={`${Constants.nativeAppVersion} (${Constants.nativeBuildVersion}) - #${GITHUB_RUN_NUMBER} - Expo ${Constants.expoVersion}`}
      />
      <InfoItem label="GQL Host" value={GRAPHQL_HOST} />
      <InfoItem label="Experience Id" value={Constants.manifest?.id} />
      <InfoItem
        value={
          Platform.OS === "ios"
            ? Constants.manifest?.ios?.bundleIdentifier
            : Constants.manifest?.android?.package
        }
        label="Identifier"
      />
      <InfoItem label="Release Channel" value={releaseChannel} />
      <InfoItem label="Slug" value={Constants.manifest?.slug} />
      <InfoItem label="Linking Prefix" value={createURL("/")} />
      <InfoItem label="Installation ID" value={Constants.installationId} />
      {Constants.deviceId !== Constants.installationId && (
        <InfoItem label="Installation ID" value={Constants.deviceId} />
      )}
      <InfoItem label="Update ID" value={updateId} />
      <Button
        onPress={async () => {
          await fetchUpdateAsync();
          await reloadAsync();
        }}
        style={styles.reload}
      >
        Update & Reload
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  reload: {
    marginTop: 20,
  },
});
