import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";

const LoginScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          // Token vẫn còn hiệu lực
          navigation.replace("Main");
        } else {
          // Token hết hạn, xóa khỏi storage
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
        }
      }
    };

    checkTokenValidity();
  }, []);

  async function authenticate() {
    const redirectUri = "exp://localhost:19002/--/spotify-auth-callback";

    // Cấu hình discovery với các endpoint cho Spotify
    const discovery = {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    };

    // Tạo yêu cầu xác thực
    const authRequest = new AuthSession.AuthRequest({
      clientId: "01be9f4db03f4b4b9eadfac76c10edac",
      scopes: [
        "user-follow-read",
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public",
      ],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
    });

    // Gọi hàm promptAsync với discovery để bắt đầu xác thực
    const result = await authRequest.promptAsync(discovery);
    console.log("Authentication result", result);

    if (result.type === "success" && result.params.access_token) {
      const expirationDate = new Date(
        Date.now() + parseInt(result.params.expires_in) * 1000
      );
      await AsyncStorage.setItem("token", result.params.access_token);
      await AsyncStorage.setItem("expirationDate", expirationDate.toString());
      navigation.navigate("Main");
    } else if (result.type === "cancel") {
      console.warn("Người dùng đã hủy xác thực.");
    } else {
      console.error("Xác thực không thành công.", result);
    }
  }

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 80 }} />
        <Entypo
          style={{ textAlign: "center" }}
          name="spotify"
          size={80}
          color="white"
        />
        <Text
          style={{
            color: "white",
            fontSize: 40,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Hàng triệu bài hát miễn phí trên Spotify!
        </Text>

        <View style={{ height: 80 }} />
        <Pressable
          onPress={authenticate}
          style={{
            backgroundColor: "#1DB954",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            width: 300,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 10,
          }}
        >
          <Text>Đăng nhập với Spotify</Text>
        </Pressable>

        {/* Các tùy chọn đăng nhập khác */}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
