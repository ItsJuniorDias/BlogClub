import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

import logo_google from "../../../../assets/images/logo_google.png";

import { Container, Logo } from "./styles";

import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "482652111919-df5osluu1irbg8g1vueqaehefchevct5.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function GoogleLogin() {
  const REDIRECT_URI = AuthSession.makeRedirectUri({
    native: "blogclub://",
  });

  const router = useRouter();

  const [response, request, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      responseType: "code",
    },
    discovery
  );

  const handleAccessAuthV2 = async () => {
    WebBrowser.openBrowserAsync(
      `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=482652111919-df5osluu1irbg8g1vueqaehefchevct5.apps.googleusercontent.com&redirect_uri=https://auth.expo.io/@itsjuniordias1997/blog-club&scope=openid%20email%20profile&access_type=offline&prompt=consent`
    )
      .then((response) => {
        console.log(response, "RESPONSE");
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        WebBrowser.dismissBrowser();

        router.push("/(tabs)");
      });
  };

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
