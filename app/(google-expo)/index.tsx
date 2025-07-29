import { WebView } from "react-native-webview";
import React, { useRef } from "react";
import { View } from "react-native";

export default function MyWebView() {
  const webViewRef = useRef(null);

  const handleNavigationChange = (navState) => {};

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{
          uri: "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=482652111919-df5osluu1irbg8g1vueqaehefchevct5.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fauth.expo.io%2F%40itsjuniordias1997%2Fblog-club&scope=openid%20email%20profile&access_type=offline&prompt=consent",
        }}
        onNavigationStateChange={handleNavigationChange}
      />
    </View>
  );
}
