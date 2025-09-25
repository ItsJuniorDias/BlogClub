import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Colors } from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <NativeTabs
      backgroundColor="transparent"
      rippleColor={Colors.light.background}
      indicatorColor={Colors.light.background}
    >
      <NativeTabs.Trigger name="home">
        <Label
          selectedStyle={{
            color: Colors.light.darkblueInfo,
          }}
        >
          Home
        </Label>
        <Icon
          sf={"house.fill"}
          drawable="ic_menu_home"
          selectedColor={Colors.light.darkblueInfo}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="new-article">
        <Label
          selectedStyle={{
            color: Colors.light.darkblueInfo,
          }}
        >
          New Article
        </Label>
        <Icon
          sf={"book.fill"}
          drawable="ic_menu_add"
          selectedColor={Colors.light.darkblueInfo}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label
          selectedStyle={{
            color: Colors.light.darkblueInfo,
          }}
        >
          Profile
        </Label>

        <Icon
          sf={"person.fill"}
          drawable="ic_menu_preferences"
          selectedColor={Colors.light.darkblueInfo}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
