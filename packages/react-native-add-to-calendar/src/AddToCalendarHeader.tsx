import { MaterialIcons } from "@expo/vector-icons";
import { captureException } from "@uplift-ltd/sentry-react-native";
import { ensureError } from "@uplift-ltd/ts-helpers";
import * as Calendar from "expo-calendar";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShareIcs } from "./useShareIcs";

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
    <SafeAreaView style={styles.header} edges={["top", "left", "right"]}>
      <TouchableOpacity style={styles.headerClose} onPress={onRequestClose}>
        <MaterialIcons style={styles.headerCloseIcon} name="arrow-back" size={24} />
      </TouchableOpacity>
      {!hideShareButton && (
        <TouchableOpacity
          style={styles.headerShare}
          onPress={async () => {
            try {
              await shareIcs(event);
            } catch (err) {
              const error = ensureError(err);
              captureException(error);
              Alert.alert(error.message);
            }
          }}
        >
          <MaterialIcons styles={styles.headerShareIcon} name="ios-share" size={24} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "white",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerClose: {},
  headerCloseIcon: {},
  headerShare: {},
  headerShareIcon: {},
});
