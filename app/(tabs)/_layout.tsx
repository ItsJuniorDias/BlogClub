import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Colors } from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";

export default function Layout() {
  const [isGuest, setIsGuest] = useState(null);

  const user = auth.currentUser;

  const getGuestFlag = async () => {
    try {
      const value = await AsyncStorage.getItem("isGuest");
      return value != null ? JSON.parse(value) : null;
    } catch (e) {
      console.log("Erro ao ler isGuest", e);
      return null;
    }
  };

  const handleGetGuestFlag = async () => {
    const isGuest = await getGuestFlag();
    console.log("isGuest:", isGuest);

    setIsGuest(isGuest);

    return isGuest;
  };

  useEffect(() => {
    handleGetGuestFlag();
  }, []);

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

      {isGuest && !user ? null : (
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
      )}

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
