import React, { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import thumbnail from "../../assets/images/thumbnail.png";

import { Container, Thumbnail } from "./styles";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <Container>
      <Thumbnail contentFit="contain" source={thumbnail} />
    </Container>
  );
}
