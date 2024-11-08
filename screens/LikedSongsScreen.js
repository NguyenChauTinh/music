import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SongItem from "../components/SongItem";
import { Player } from "../app/PlayerContext";

const LikedSongsScreen = () => {
  const colors = [
    "#27374D",
    "#1D267D",
    "#BE5A83",
    "#212A3E",
    "#917FB3",
    "#37306B",
    "#443C68",
    "#5B8FB9",
    "#144272",
  ];
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [savedTracks, setSavedTracks] = useState([]);
  // const { currentTrack, setCurrentTrack } = useContext(Player);

  async function getSavedTracks() {
    const accessToken = await AsyncStorage.getItem("token");
    const response = await fetch(
      "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
        },
      }
    );

    if (!response.ok) {
      throw new Error("failed to fetch the tracks");
    }
    const data = await response.json();
    setSavedTracks(data.items);
  }
  useEffect(() => {
    getSavedTracks();
  }, []);

  // console.log(savedTracks);

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }
    await play(savedTracks[0]);
  };

  return (
    <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, marginTop: 50 }}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{ marginHorizontal: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Pressable
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 9,
          }}
        >
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: "#42275a",
              padding: 9,
              flex: 1,
              borderRadius: 3,
              height: 38,
            }}
          >
            <AntDesign name="search1" size={20} color="white" />
            <TextInput
              value={input}
              // onChangeText={(text) => handleInputChange(text)}
              placeholder="Find in Liked songs"
              placeholderTextColor={"white"}
              style={{ fontWeight: "500", color: "white" }}
            />
          </Pressable>

          <Pressable
            style={{
              marginHorizontal: 10,
              backgroundColor: "#42275a",
              padding: 10,
              borderRadius: 3,
              height: 38,
            }}
          >
            <Text style={{ color: "white" }}>Sort</Text>
          </Pressable>
        </Pressable>

        <View style={{ height: 50 }} />

        <View style={{ marginHorizontal: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
            Liked Songs
          </Text>
          <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>
            430 songs
          </Text>
        </View>

        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginHorizontal: 10,
          }}
        >
          <Pressable
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              backgroundColor: "#1DB954",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AntDesign name="arrowdown" size={20} color="white" />
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons
              name="cross-bolnisi"
              size={24}
              color="#1DB954"
            />
            <Pressable
              // onPress={playTrack}
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#1DB954",
              }}
            >
              <Entypo name="controller-play" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={savedTracks}
          renderItem={({ item }) => (
            <SongItem
              item={item}
              // onPress={play}
              // isPlaying={item === currentTrack}
            />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({});
