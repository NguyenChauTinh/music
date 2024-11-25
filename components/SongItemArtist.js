import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import { Entypo } from "@expo/vector-icons";
import { Player } from "../app/PlayerContext";

const SongItem = ({ item, onPress, isPlaying, index }) => {
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
      {/* Số thứ tự */}
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
          width: 50, // Đặt độ rộng cố định để căn chỉnh
          textAlign: "center",
          paddingRight: 10,
        }}
      >
        {index + 1}
      </Text>
      {/* Hình ảnh */}

      {/* <Image
        style={{ width: 50, height: 50, marginRight: 10 }}
        source={{
          uri:
            item?.track?.album?.images[0]?.url ||
            "https://play-lh.googleusercontent.com/D9X7m5dTNzjeSPxBqzh1RwrZLXJDFTpht9-8W8RJtiaOAlFxNvL5MnSDRxoDnQRYhz0=w240-h480-rw", // URL hình ảnh mặc định
        }}
      /> */}
      {/* Thông tin bài hát */}
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
          {item?.artists[0]?.name}
        </Text>
      </View>
      {/* Menu tùy chọn */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
          marginHorizontal: 10,
        }}
      >
        <Entypo name="dots-three-vertical" size={24} color="#C0C0C0" />
      </View>
    </Pressable>
  );
};

export default SongItem;

const styles = StyleSheet.create({});
