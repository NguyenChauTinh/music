import { Stack } from "expo-router";

import HomeScreen from "../screens/HomeScreen";
import Navigation from "./StackNavigator";
import { PlayerContext } from "./PlayerContext";
export default function RootLayout() {
  return (
    <>
      <PlayerContext>
        <Navigation />
      </PlayerContext>
    </>
  );
}
