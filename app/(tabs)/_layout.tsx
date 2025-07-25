// app/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import TabBar from "../(new-article)/components/tab-bar/tab-bar";
import ButtonFloat from "../(profile)/components/buttonFloat";

export default function Layout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          marginLeft: 20,
          marginRight: 20,
          bottom: insets.bottom + 16,
          height: 60,
          borderRadius: 30,
          overflow: "hidden",
          borderWidth: 0,
          borderColor: "#FFFFFF",
          elevation: 0,
          backgroundColor: "#ffffff",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint={"light"}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: Colors.light.blue,
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-article"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size }) => (
            <TabBar onPress={() => router.push("/new-article")} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <ButtonFloat
              onPress={() => router.push("/(tabs)/profile")}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
