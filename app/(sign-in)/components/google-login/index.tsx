import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";

import {
  GoogleSignin,
  statusCodes,
  User,
} from "@react-native-google-signin/google-signin";

import logo_google from "../../../../assets/images/logo_google.png";

import { Container, Logo } from "./styles";

import { useRouter } from "expo-router";

import { useUserStore } from "@/store/useUserStore";

WebBrowser.maybeCompleteAuthSession();

const result = GoogleSignin.configure({
  iosClientId:
    "482652111919-rf1smagh2da9adn247c21d7q226qp712.apps.googleusercontent.com",
  webClientId:
    "482652111919-mm9bkh2nbego2thtkjiaokg03b9anutv.apps.googleusercontent.com",
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  scopes: [
    "email",
    "profile",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
});

console.log(result, "CONFIG");

export default function GoogleLogin() {
  const [data, setData] = useState<User>();

  const { fetch } = useUserStore();

  const router = useRouter();

  return (
    <>
      <Container
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices({
              showPlayServicesUpdateDialog: true,
            });

            const response = await GoogleSignin.signIn();

            setData(response);

            fetch({
              id: response.user.id,
              email: response.user.email,
              name: response?.user?.name,
              thumbnail: response?.user?.photo,
            });

            router.push("/(tabs)/home");
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              console.log(error.code, "CANCELLED");
            } else if (error.code === statusCodes.IN_PROGRESS) {
              console.log(error.code, "IN_PROGRESS");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              console.log(error.code, "PLAY_SERVICES_NOT_AVAILABLE");
            } else {
              console.error(error);
            }
          }
        }}
      >
        <Logo source={logo_google} />
      </Container>
    </>
  );
}
