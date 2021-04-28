import { StatusBar } from "expo-status-bar";
import React from "react";
import AppNavigation from "./navigation/AppNavigation";

export default function App() {
  return (
    <>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
      <AppNavigation />
    </>
  );
}
