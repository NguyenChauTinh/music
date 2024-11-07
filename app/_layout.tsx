import { Stack } from "expo-router";

import HomeScreen from "../screens/HomeScreen";
import Navigation from "./StackNavigator";
export default function RootLayout() {
  return (
    <>
      <Navigation />
    </>
  );
}
