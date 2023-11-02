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
  value: boolean | null | number | string | undefined;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={value ? 0.6 : 1}
      onPress={() => value && Clipboard.setString(value?.toString())}
      style={styles.infoItem}
    >
      <Text style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}: </Text>
        <Text style={styles.infoValue}>{value || "N/A"}</Text>
      </Text>
    </TouchableOpacity>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

export function Button({ children, onPress, style }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
}

export function Input({ style, ...props }: TextInputProps) {
  return <TextInput style={[styles.input, style]} {...props} />;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ddd",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    textAlign: "center",
  },
  infoItem: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoText: {},
  infoValue: {},
  input: {
    borderColor: "gray",
    borderWidth: 1,
    height: 40,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});
