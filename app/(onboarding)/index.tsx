import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { Text } from "../../components/ui";

import thumbnail from "../../assets/images/thumbnail.png";

import { Container, Thumbnail, Body, Footer, Button } from "./styles";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingScreen() {
  const router = useRouter();

  const saveGuestFlag = async (value) => {
    try {
      await AsyncStorage.setItem("isGuest", JSON.stringify(value));
    } catch (e) {
      console.log("Erro ao salvar isGuest", e);
    }
  };

  useEffect(() => {
    saveGuestFlag(false);
  }, []);

  return (
    <Container>
      <Thumbnail contentFit="fill" source={thumbnail} />

      <Body>
        <Text
          title={`Read the article you\nwant instantly`}
          fontFamily="semi-bold"
          fontSize={24}
          lineHeight={32}
          color={Colors.light.darkBlue}
        />

        <Text
          title={`You can read hundreds of articles on Blog\nClub, save them in the application and share\nthem with your loved ones.`}
          fontFamily="regular"
          fontSize={14}
          lineHeight={22}
          color={Colors.light.blueText}
        />

        <Footer>
          <TouchableOpacity
            onPress={() => {
              saveGuestFlag(true);

              router.push("/(tabs)/home");
            }} // ou a tela inicial do app
            style={{ marginTop: 24 }}
          >
            <Text
              title="Continue as guest"
              fontFamily="semi-bold"
              fontSize={16}
              color={Colors.light.blue}
              style={{ textAlign: "center" }}
            />
          </TouchableOpacity>

          <Button onPress={() => router.push("/(sign-in)")} activeOpacity={0.7}>
            <Feather name="arrow-right" size={24} color="white" />
          </Button>
        </Footer>
      </Body>
    </Container>
  );
}
