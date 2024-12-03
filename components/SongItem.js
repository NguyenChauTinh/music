import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Player } from "../app/PlayerContext";

const SongItem = ({ item, onPress, isPlaying }) => {
  const { currentTrack, setCurrentTrack } = useContext(Player);
  const handlePress = () => {
    setCurrentTrack(item);
    onPress(item);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
    >
      <Image
        style={{ width: 50, height: 50, marginRight: 10 }}
        source={{ uri: "https://sctt.net.vn/wp-content/uploads/2021/06/spotify_hero_4-1024x474.jpg" }}
      />

      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={
            isPlaying
              ? {
                  fontWeight: "bold",
                  fontSize: 14,
                  color: "#3FFF00",
                }
              : { fontWeight: "bold", fontSize: 14, color: "white" }
          }
        >
          {item?.name}
        </Text>
        <Text style={{ marginTop: 4, color: "#989898" }}>
          {item?.artist.name}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          marginHorizontal: 10,
        }}
      >
        <AntDesign name="heart" size={24} color="#1DB954" />
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
