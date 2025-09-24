import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Colors } from "../../constants/Colors";

export default function Layout() {
  return (
    <NativeTabs
      backgroundColor="transparent"
      rippleColor={Colors.light.darkBlue}
      indicatorColor={Colors.light.darkBlue}
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
          drawable="ic_menu_manage"
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
          drawable="ic_menu_manage"
          selectedColor={Colors.light.darkblueInfo}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
