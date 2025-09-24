// app/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TabBar from "../(new-article)/components/tab-bar/tab-bar";
import ButtonFloat from "../(profile)/components/buttonFloat";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function Layout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <NativeTabs
      backgroundColor="transparent"
      rippleColor={Colors.light.darkblueInfo}
      indicatorColor={Colors.light.darkblueInfo}
    >
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf={"house.fill"} drawable="ic_menu_home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="new-article">
        <Label>New Article</Label>
        <Icon sf={"book.fill"} drawable="ic_menu_manage" />
        {/* <Badge>9+</Badge> */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Profile</Label>
        <Icon sf={"person.fill"} drawable="ic_menu_manage" />
        {/* <Badge>9+</Badge> */}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
