import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import ArtistCard from "../components/ArtistCard";
import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import { useNavigation } from "@react-navigation/native";

// import fetchh from "isomorphic-unfetch";
// import spotifyUrlInfo from 'spotify-url-info';

import { Buffer } from 'buffer';

const HomeScreen = () => {
  const [userProfile, setUserProfile] = useState();
  const navigation = useNavigation();
  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [trendingTracks, setTrendingTracks] = useState([]);

  const fetchh = require('isomorphic-unfetch')
  const { getData, getPreview, getTracks, getDetails } =
  require('spotify-url-info')(fetchh)

  global.Buffer = Buffer;
  


  const greetingMessage = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return "Good Morning";
    } else if (currentTime < 16) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };
  const message = greetingMessage();

  const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setUserProfile(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // console.log(userProfile);

  const getRecentlyPlayedSongs = async () => {
    const accessToken = await AsyncStorage.getItem("token");
    try {
      const response = await axios({
        method: "GET",
        url: "https://api.spotify.com/v1/me/player/recently-played?limit=4",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const tracks = response.data.items;
      setRecentlyPlayed(tracks);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getRecentlyPlayedSongs();
  }, []);

  // console.log(recentlyplayed);

  async function handleArtistPress(artist) {
    const artistId = artist.id;
    console.log("Artist ID:", artistId);
    navigation.navigate("Artist", { artistId });
  }

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 8,
          backgroundColor: "#282828",
          borderRadius: 4,
          elevation: 3,
        }}
      >
        <Image
          style={{ height: 55, width: 55 }}
          source={{ uri: item.track.album.images[0].url }}
        />
        <View
          style={{ flex: 1, marginHorizontal: 8, justifyContent: "center" }}
        >
          <Text
            numberOfLines={2}
            style={{ fontSize: 13, fontWeight: "bold", color: "white" }}
          >
            {item.track.name}
          </Text>
        </View>
      </Pressable>
    );
  };

  // useEffect(() => {
  //   const getTopItems = async () => {
  //     try {
  //       const accessToken = await AsyncStorage.getItem("token");
  //       if (!accessToken) {
  //         console.log("Access token not found");
  //         return;
  //       }
  //       const type = "artists";
  //       const response = await axios.get(
  //         `https://api.spotify.com/v1/me/top/${type}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         }
  //       );
  //       setTopArtists(response.data.items);
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   };

  //   getTopItems();
  // }, []);

  // console.log(topArtists);

  useEffect(() => {
    const getFollowedArtists = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        if (!accessToken) {
          console.log("Access token not found");
          return;
        }

        const response = await axios.get(
          "https://api.spotify.com/v1/me/following?type=artist",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setFollowedArtists(response.data.artists.items);
      } catch (err) {
        console.log("Error fetching followed artists:", err.message);
      }
    };

    getFollowedArtists();
  }, []);

  // console.log(followedArtists);

//   const getTrendingTracks = async () => {
//     const playlistUrl = 'https://open.spotify.com/playlist/1dwSo4UbntD8UvmiHcZpVM';
//     console.log('Fetching playlist:', playlistUrl);
    
//     try {
//         const data = await getPreview(playlistUrl);
//         console.log('Fetched data:', data);
//         if (!data) {
//             console.log('No data returned');
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };



const getTrendingTracks = async () => {
  const playlistUrl = "https://open.spotify.com/playlist/1dwSo4UbntD8UvmiHcZpVM";

  try {
    const tracks = await getTracks(playlistUrl, { fetch: fetchh }); // Sử dụng fetchh từ isomorphic-unfetch
    const first10Tracks = tracks.slice(0, 10); // Chỉ lấy 10 bài hát đầu tiên
    console.log("First 10 tracks:", first10Tracks);
    setTrendingTracks(first10Tracks); // Lưu kết quả vào state
  } catch (error) {
      console.error("Error fetching tracks:", error.message);
  }
  };

  useEffect(() => {
    getTrendingTracks();
  }, []);

  const renderTrendingTrack = ({ item }) => (
    <Pressable
        style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#282828",
            marginVertical: 8,
            marginHorizontal: 10,
            borderRadius: 8,
            padding: 10,
        }}
    >
        <Image
            style={{ width: 55, height: 55, borderRadius: 4 }}
            source={{ uri: item.coverArt }} // Sử dụng đúng field trả về từ `getTracks`
        />
        <View style={{ marginLeft: 10 }}>
            <Text
                numberOfLines={1}
                style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
            >
                {item.name}
            </Text>
            <Text
                numberOfLines={1}
                style={{ fontSize: 13, color: "gray", marginTop: 4 }}
            >
                {item.artist}
            </Text>
        </View>
    </Pressable>
);


  // const renderTrendingTrack = ({ item }) => (
  //   <Pressable
  //     style={{
  //       flexDirection: "row",
  //       alignItems: "center",
  //       backgroundColor: "#282828",
  //       marginVertical: 8,
  //       marginHorizontal: 10,
  //       borderRadius: 8,
  //       padding: 10,
  //     }}
  //   >
  //     <Image
  //       style={{ width: 55, height: 55, borderRadius: 4 }}
  //       source={{ uri: item.track.album.images[0].url }}
  //     />
  //     <View style={{ marginLeft: 10 }}>
  //       <Text
  //         numberOfLines={1}
  //         style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
  //       >
  //         {item.track.name}
  //       </Text>
  //       <Text
  //         numberOfLines={1}
  //         style={{ fontSize: 13, color: "gray", marginTop: 4 }}
  //       >
  //         {item.track.artists.map((artist) => artist.name).join(", ")}
  //       </Text>
  //     </View>
  //   </Pressable>
  // );

 

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 50 }}>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                resizeMode: "cover",
              }}
              source={{ uri: userProfile?.images[0].url }}
            />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {message}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color="white"
          />
        </View>

        <View
          style={{
            marginHorizontal: 12,
            marginVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Pressable
            style={{
              backgroundColor: "#282828",
              padding: 10,
              borderRadius: 30,
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>Music</Text>
          </Pressable>

          <Pressable
            style={{
              backgroundColor: "#282828",
              padding: 10,
              borderRadius: 30,
            }}
          >
            <Text style={{ fontSize: 15, color: "white" }}>
              Podcasts & Shows
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 10 }} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => navigation.navigate("Liked")}
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3,
            }}
          >
            <LinearGradient colors={["#33006F", "#FFFFFF"]}>
              <Pressable
                style={{
                  width: 55,
                  height: 55,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign name="heart" size={24} color="white" />
              </Pressable>
            </LinearGradient>

            <Text style={{ color: "white", fontSize: 13, fontWeight: "bold" }}>
              Liked Songs
            </Text>
          </Pressable>

          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              flex: 1,
              marginHorizontal: 10,
              marginVertical: 8,
              backgroundColor: "#202020",
              borderRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              style={{ width: 55, height: 55 }}
              source={{ uri: "https://i.pravatar.cc/100" }}
            />
            <View style={styles.randomArtist}>
              <Text
                style={{ color: "white", fontSize: 13, fontWeight: "bold" }}
              >
                Hiphop Tamhiza
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={recentlyplayed}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          nestedScrollEnabled={true}
        />

        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          Trending Tracks
        </Text>
        <FlatList
          data={trendingTracks}
          renderItem={renderTrendingTrack}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />

        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          Your Follower Artists
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {followedArtists.map((item, index) => (
            <Pressable key={index} onPress={() => handleArtistPress(item)}>
              <ArtistCard item={item} />
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ height: 10 }} />

        <Text
          style={{
            color: "white",
            fontSize: 19,
            fontWeight: "bold",
            marginHorizontal: 10,
            marginTop: 10,
          }}
        >
          Recently Played
        </Text>
        <FlatList
          // style={{ marginVertical: 10 }}
          data={recentlyplayed}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <RecentlyPlayedCard item={item} key={index} />
          )}
        />
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
