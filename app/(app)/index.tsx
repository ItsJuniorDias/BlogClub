import React, { useEffect } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";

import logo from "../../assets/images/logo.png";

import { Container, Logo } from "./styles";
import { useRouter } from "expo-router";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useUserStore } from "@/store/useUserStore";

export default function SplashScreen() {
  const { fetch } = useUserStore();

  const router = useRouter();

  const auth = getAuth();

  const queryUserByUID = async (uid: string | undefined) => {
    const usersRef = collection(db, "users");

    const q = query(usersRef, where("id", "==", uid));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];

      return doc.data();
    } else {
      return null;
    }
  };

  const handleAuthState = async () => {
    onAuthStateChanged(auth, async (user) => {
      const uid = user?.uid;

      fetch(queryUserByUID(uid));

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
