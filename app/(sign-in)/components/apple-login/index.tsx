import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Alert } from "react-native";

export default function AppleLogin() {
  const router = useRouter();

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      await SecureStore.setItemAsync("user", JSON.stringify(credential));

      router.push("/(tabs)");
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        Alert.alert("Canceled", "User canceled Apple Sign-In.");
      } else {
        Alert.alert("Error", e.message);
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 200, height: 44 }}
      onPress={signInWithApple}
    />
  );
}
