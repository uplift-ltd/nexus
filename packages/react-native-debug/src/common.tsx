import React from "react";
import {
  Clipboard,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface InfoItemProps {
  label: string;
  value: string | number | boolean | null | undefined;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <TouchableOpacity
    style={styles.infoItem}
    onPress={() => value && Clipboard.setString(value?.toString())}
    activeOpacity={value ? 0.6 : 1}
  >
    <Text style={styles.infoText}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </Text>
  </TouchableOpacity>
);

interface ButtonProps {
  style?: ViewStyle;
  onPress: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
);

export const Input: React.FC<TextInputProps> = ({ style, ...props }) => (
  <TextInput style={[styles.input, style]} {...props} />
);

const styles = StyleSheet.create({
  infoItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  infoText: {},
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {},
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#ddd",
  },
  buttonText: {
    textAlign: "center",
  },
  input: {
    height: 40,
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: "gray",
    borderWidth: 1,
  },
});
