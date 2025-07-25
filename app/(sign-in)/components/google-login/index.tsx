import React, { useEffect } from "react";
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

  // useEffect(() => {
  //   if (!!response) {
  //     const access_token =
  //       "ya29.A0AS3H6NyDhwPTH3Tyu0CZGdvO5J5otGxdVPtqWeeR6P4sbCIKyF1N5-Mdb6x7twjooo4Qqol1YM78dAK1dAI72AFdQKYrYDyjYUZ0hF1pieJphBwvI0DaEPGZO4w75CRYLOCZOAHY5ZG5H2KOcGhhPanp3xMMQA90eVZe4AlMtokX7nBvlUrRi4YcNUMZn0B2Vzp7Wg0aCgYKAaASARESFQHGX2Mie8xXUkVWzqYupCznCVQEhg0206";

  //     fetch("https://www.googleapis.com/userinfo/v2/me", {
  //       headers: { Authorization: `Bearer ${access_token}` },
  //     })
  //       .then((res) => res.json())
  //       .then((user) => {
  //         console.log(user, "USER");
  //       });
  //   }
  // }, [response]);

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
          // router.push("/(google-expo)");

          handleAccessAuthV2();
        }}
      >
        <Logo source={logo_google} />
      </Container>
    </>
  );
}
