import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from "../../assets/images/icon.png";
import { useRouter } from "expo-router";
import { useUserStore } from "../../store/useUserStore";
import { queryUserByUID } from "../../utils/queryUserByUID";
import { Container } from "./styles";

export default function SplashScreen() {
  const { fetch } = useUserStore();
  const router = useRouter();
  const auth = getAuth();

  const translateX = useRef(new Animated.Value(300)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleAuthState = async () => {
    onAuthStateChanged(auth, async (user) => {
      const uid = user?.uid;
      fetch(queryUserByUID(uid));

      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.5,
          duration: 600,
          easing: Easing.out(Easing.circle),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (user) {
          router.push("/(tabs)/home");
        } else {
          router.push("/(onboarding)");
        }
      });
    });
  };

  useEffect(() => {
    handleAuthState();
  }, [router]);

  return (
    <Container>
      <Animated.Image
        source={logo}
        style={{
          width: 120,
          height: 120,
          transform: [{ translateX }, { scale }],
          opacity,
        }}
        resizeMode="contain"
      />
    </Container>
  );
}
