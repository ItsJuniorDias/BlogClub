import React, { useCallback, useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

import logo_google from "../../../../assets/images/logo_google.png";

import { Button, Alert } from "react-native";
import { Container, Logo } from "./styles";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "482652111919-aj1h9ujp1pg79quan5rqcam0cp9boec6.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function GoogleLogin() {
  const [response, request, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: "https://auth.expo.io/@itsjuniordias1997/blog-club",
      scopes: ["openid", "profile", "email"],
      responseType: "code",
    },
    discovery
  );

  console.log(response, "RESPONSE");

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { access_token } = response.params;

  //     fetch("https://www.googleapis.com/userinfo/v2/me", {
  //       headers: { Authorization: `Bearer ${access_token}` },
  //     })
  //       .then((res) => res.json())
  //       .then((user) => {
  //         console.log(user, "USER");

  //         Alert.alert("Welcome", `Hello ${user.name}`);
  //         console.log("User Info:", user);
  //       });
  //   }
  // }, [response]);

  return (
    <Container disabled={!response} onPress={() => promptAsync()}>
      <Logo source={logo_google} />
    </Container>
  );
}
