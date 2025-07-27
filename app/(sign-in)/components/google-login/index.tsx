import React, { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

import logo_google from "../../../../assets/images/logo_google.png";

import { Container, Logo } from "./styles";

import { useRouter } from "expo-router";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { WebBrowserResultType } from "expo-web-browser";
import { useOpenBrowserAsync } from "@/hooks/useOpenBrowserAsync";
WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "482652111919-df5osluu1irbg8g1vueqaehefchevct5.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function GoogleLogin() {
  const { fetch } = useUserStore();

  const router = useRouter();

  const { openAuthSessionAsync } = useOpenBrowserAsync();

  const [response, request, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: "https://auth.expo.io/@itsjuniordias1997/blog-club",
      scopes: ["openid", "profile", "email"],
      responseType: "code",
    },
    discovery
  );

  const handleAccessAuthV2 = useCallback(async () => {
    try {
      await openAuthSessionAsync(
        "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=482652111919-df5osluu1irbg8g1vueqaehefchevct5.apps.googleusercontent.com&redirect_uri=https://auth.expo.io/@itsjuniordias1997/blog-club&scope=openid%20email%20profile&access_type=offline&prompt=consent",
        "blogclub://home"
      );

      WebBrowser.dismissBrowser();

      // handleAccessToken();
    } catch (e) {
      console.log(e);
    }
  }, [response]);

  // const handleAccessToken = async () => {
  //   try {
  //     const responseToken = await axios.post(
  //       "https://oauth2.googleapis.com/token",
  //       {
  //         client_id: response?.clientId,
  //         client_secret: "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",
  //         code: "4/0AVMBsJhwKiCBiMEcbNHu9Z-I8E-IzqtRY1UkFIbJpelRLdqOOQuDh1_T551rCNIonBELeA",
  //         codeChallenge: response?.codeChallenge,
  //         redirect_uri: response?.redirectUri,
  //         grant_type: "authorization_code",
  //         refresh_token: "",
  //       }
  //     );

  //     console.log(responseToken.data, "TOKEN DATA");

  //     const responseUser = await axios.get(
  //       "https://www.googleapis.com/userinfo/v2/me",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${responseToken.data.access_token}`,
  //         },
  //       }
  //     );

  //     const { id, name, email, picture } = responseUser.data;

  //     fetch({
  //       id,
  //       name,
  //       email,
  //       thumbnail: picture,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <>
      <Container
        disabled={!response}
        onPress={() => {
          handleAccessAuthV2();
        }}
      >
        <Logo source={logo_google} />
      </Container>
    </>
  );
}
