import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import UpliftLogo from "../assets/uplift-logo.png";
import Screens from "../navigation/screens";

import SpaceBetween from "./common/SpaceBetween";

interface LinkProps {
  children: string;
  to: Screens;
}

const Link = ({ children, to }: LinkProps) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate(to)}
      style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
    >
      <Text style={styles.linkText}>{children}</Text>
    </Pressable>
  );
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={UpliftLogo} style={styles.upliftLogo} />
        <Text>Example Expo app for Uplift Nexus packages.</Text>
      </View>

      <View style={styles.links}>
        <SpaceBetween y={12}>
          <Link to={Screens.ADD_TO_CALENDAR}>Add To Calendar</Link>
        </SpaceBetween>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  upliftLogo: {},
  links: {
    marginVertical: 10,
  },
  link: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  linkPressed: {
    opacity: 0.6,
  },
  linkText: {
    color: "teal",
    fontSize: 20,
  },
});

export const homeScreenOptions = {
  title: "Home",
};

export default HomeScreen;
