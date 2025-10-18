import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";

import { Stack } from "expo-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import { useEffect } from "react";
import { useColorScheme } from "../hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  const [loaded] = useFonts({
    MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
  });

  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.hideAsync();
    };
    prepare();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="dark" />

        <Stack initialRouteName="(app)/index">
          <Stack.Screen name="(app)/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="(onboarding)/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(story)/index" options={{ headerShown: false }} />

          <Stack.Screen
            name="(article)/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(sign-in)/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(forgot-password)/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(google-expo)/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(chat)/index" options={{ headerShown: false }} />

          <Stack.Screen
            name="(started-conversations)/index"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
