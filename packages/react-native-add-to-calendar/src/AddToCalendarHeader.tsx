import { MaterialIcons } from "@expo/vector-icons";
import Sentry from "@uplift-ltd/sentry";
import * as Sharing from "expo-sharing";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export interface AddToCalendarHeaderProps {
  sharePath?: string;
  onRequestClose: () => void;
}

export const AddToCalendarHeader: React.FC<AddToCalendarHeaderProps> = ({
  sharePath,
  onRequestClose,
}) => {
  return (
    <SafeAreaView style={styles.header} edges={["top", "left", "right"]}>
      <TouchableOpacity style={styles.headerClose} onPress={onRequestClose}>
        <MaterialIcons style={styles.headerCloseIcon} name="arrow-back" size={24} />
      </TouchableOpacity>
      {Boolean(sharePath) && (
        <TouchableOpacity
          style={styles.headerShare}
          onPress={async () => {
            try {
              await Sharing.shareAsync(sharePath as string);
            } catch (err) {
              Sentry.captureException(err);
              Alert.alert(err);
            }
          }}
        >
          <MaterialIcons styles={styles.headerShareIcon} name="ios-share" size={24} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

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
