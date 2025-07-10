import React, { useEffect } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import logo from "../../assets/images/logo.png";

import { Container, Logo } from "./styles";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();

  const auth = getAuth();

  const handleAuthState = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        return router.push("/(tabs)");
      } else {
        setTimeout(() => {
          return router.push("/(onboarding)");
        }, 2000);
      }
    });
  };

  useEffect(() => {
    handleAuthState();
  }, [router]);

  return (
    <Container>
      <Logo source={logo} />
    </Container>
  );
}
