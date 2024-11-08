import { Stack } from "expo-router";

import HomeScreen from "../screens/HomeScreen";
import Navigation from "./StackNavigator";
import { PlayerContext } from "./PlayerContext";
import { ModalPortal } from "react-native-modals";
export default function RootLayout() {
  return (
    <>
      <PlayerContext>
        <Navigation />
        <ModalPortal />
      </PlayerContext>
    </>
  );
}
