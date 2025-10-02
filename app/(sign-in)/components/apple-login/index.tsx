import { Text } from "@/components/ui";
import { useUserStore } from "@/store/useUserStore";
import * as AppleAuthentication from "expo-apple-authentication";

import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";

export default function AppleLogin() {
  const [result, setResult] = useState<string | null>(null);

  const { fetch } = useUserStore();

  const router = useRouter();

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log(credential, "CREDENTIAL");

      if (!!credential.email) {
        await SecureStore.setItemAsync("user", JSON.stringify(credential));

        const defaultUser = await SecureStore.getItemAsync("user");

        const user = JSON.parse(defaultUser ?? "");

        fetch({
          id: user,
          email: user.email,
          name: `${user.fullName.givenName} ${user.fullName.familyName}`,
          thumbnail: "",
        });
      }

      router.push("/(tabs)/home");
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") {
        Alert.alert("Canceled", "User canceled Apple Sign-In.");
      } else {
        Alert.alert("Error", error.message);
        console.log(error, "ERROR");
      }
    }
  };

  return (
    <>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.button}
        onPress={signInWithApple}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 44,
  },
});
