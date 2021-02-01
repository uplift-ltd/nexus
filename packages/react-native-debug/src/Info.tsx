import { StackScreenProps } from "@react-navigation/stack";
import { GITHUB_SHA, GRAPHQL_HOST } from "@uplift-ltd/constants";
import Constants from "expo-constants";
import { makeUrl } from "expo-linking";
import { fetchUpdateAsync, releaseChannel, reloadAsync, updateId } from "expo-updates";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { Button, InfoItem } from "./common";
import { DebugScreens } from "./screens";
import { DebugNavigatorParamList } from "./types";

type InfoProps = StackScreenProps<DebugNavigatorParamList, DebugScreens.DEBUG_MAGIC_LOGIN>;

export const Info: React.FC<InfoProps> = () => {
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
        label="Versions"
        value={`${Constants.nativeAppVersion} (${Constants.nativeBuildVersion}) - ${Constants.expoVersion}`}
      />
      <InfoItem label="Installation ID" value={Constants.installationId} />
      {Constants.deviceId !== Constants.installationId && (
        <InfoItem label="Installation ID" value={Constants.deviceId} />
      )}
      <InfoItem label="Update ID" value={updateId} />
      <Button
        style={styles.reload}
        onPress={async () => {
          await fetchUpdateAsync();
          await reloadAsync();
        }}
      >
        Update & Reload
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  reload: {
    marginTop: 20,
  },
});
