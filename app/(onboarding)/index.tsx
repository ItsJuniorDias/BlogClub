import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { Text } from "../../components/ui";

import thumbnail from "../../assets/images/thumbnail.png";

import {
  Container,
  Thumbnail,
  Body,
  Title,
  Description,
  Footer,
  Button,
} from "./styles";
import { Colors } from "@/constants/Colors";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <Container>
      <Thumbnail source={thumbnail} />

      <Body>
        <Text
          title={`Read the article you\nwant instantly`}
          fontFamily="semi-bold"
          fontSize={24}
          lineHeight={32}
          color={Colors.light.darkBlue}
        />

        <Text
          title={`You can read thousands of articles on Blog\nClub, save them in the application and share\nthem with your loved ones.`}
          fontFamily="regular"
          fontSize={14}
          lineHeight={22}
          color={Colors.light.blueText}
        />

        <Footer>
          <View />

          <Button onPress={() => router.push("/(sign-in)")} activeOpacity={0.7}>
            <Feather name="arrow-right" size={24} color="white" />
          </Button>
        </Footer>
      </Body>
    </Container>
  );
}
