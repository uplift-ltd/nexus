import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppNavigation } from "./navigation";

console.log("APP");

export default function App() {
  return (
    <>
      {/* eslint-disable-next-line react/style-prop-object */}
      <StatusBar style="auto" />
      <AppNavigation />
    </>
  );
}
