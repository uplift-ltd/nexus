import { MaterialIcons } from "@expo/vector-icons";
import { captureException } from "@uplift-ltd/sentry-react-native";
import { ensureError } from "@uplift-ltd/ts-helpers";
import * as Calendar from "expo-calendar";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { useShareIcs } from "./useShareIcs.js";

export interface AddToCalendarHeaderProps {
  event: Calendar.Event;
  hideShareButton?: boolean;
  onRequestClose: () => void;
}

export function AddToCalendarHeader({
  event,
  hideShareButton,
  onRequestClose,
}: AddToCalendarHeaderProps) {
  const shareIcs = useShareIcs();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.header}>
      <TouchableOpacity onPress={onRequestClose} style={styles.headerClose}>
        <MaterialIcons name="arrow-back" size={24} style={styles.headerCloseIcon} />
      </TouchableOpacity>
      {!hideShareButton && (
        <TouchableOpacity
          onPress={async () => {
            try {
              await shareIcs(event);
            } catch (err) {
              const error = ensureError(err);
              captureException(error);
              Alert.alert(error.message);
            }
          }}
          style={styles.headerShare}
        >
          <MaterialIcons name="ios-share" size={24} styles={styles.headerShareIcon} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerClose: {},
  headerCloseIcon: {},
  headerShare: {},
  headerShareIcon: {},
});
