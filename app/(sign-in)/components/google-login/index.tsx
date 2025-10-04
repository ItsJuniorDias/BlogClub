import React from "react";
import * as WebBrowser from "expo-web-browser";

import { GoogleSignin, User } from "@react-native-google-signin/google-signin";

import logo_google from "../../../../assets/images/logo_google.png";

import { Container, Logo } from "./styles";

import { useRouter } from "expo-router";

import { useUserStore } from "@/store/useUserStore";
import { Alert } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const { fetch } = useUserStore();

  const router = useRouter();

  GoogleSignin.configure({
    webClientId:
      "482652111919-mm9bkh2nbego2thtkjiaokg03b9anutv.apps.googleusercontent.com",
    iosClientId:
      "482652111919-rf1smagh2da9adn247c21d7q226qp712.apps.googleusercontent.com",
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const { data } = await GoogleSignin.signIn();

      console.log(data, "DATAA");

      fetch({
        id: data?.user.id || "",
        email: data?.user.email || "",
        name: data?.user?.name || "",
        thumbnail: data?.user?.photo || "",
      });

      Alert.alert(
        "Read Only Mode",
        "This is a read-only section. Please create a BlogClub account to start posting.",
        [
          {
            text: "Cancel",
            style: "destructive",
          },
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/home"),
            style: "default",
          },
        ]
      );
    } catch (error: any) {
      console.log(error, "ERROR");
    }
  };

  return (
    <>
      <Container onPress={handleGoogleSignIn}>
        <Logo source={logo_google} />
      </Container>
    </>
  );
}
