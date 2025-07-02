import React, { useEffect } from "react";
import { View } from "react-native";

import logo from "../../assets/images/logo.png";

import { Container, Logo } from "./styles";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      return router.push("/(tabs)");
    }, 2000);
  }, [router]);

  return (
    <Container>
      <Logo source={logo} />
    </Container>
  );
}
