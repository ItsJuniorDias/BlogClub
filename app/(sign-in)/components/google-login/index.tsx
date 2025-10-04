import React from "react";
import * as WebBrowser from "expo-web-browser";

import { GoogleSignin, User } from "@react-native-google-signin/google-signin";

import logo_google from "../../../../assets/images/logo_google.png";

import { Container, Logo } from "./styles";

import { useRouter } from "expo-router";

import { useUserStore } from "@/store/useUserStore";
import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const { fetch } = useUserStore();

  const router = useRouter();

  GoogleSignin.configure({
    webClientId:
      "482652111919-mm9bkh2nbego2thtkjiaokg03b9anutv.apps.googleusercontent.com",
    iosClientId:
      "482652111919-rf1smagh2da9adn247c21d7q226qp712.apps.googleusercontent.com",
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const { data } = await GoogleSignin.signIn();

      const email = data?.user?.email;
      const name = data?.user?.name || "";
      const photo = data?.user?.photo || "";

      console.log(data, "DATAA");

      if (!email) {
        Alert.alert("Erro", "Não foi possível obter o e-mail do Google.");
        return;
      }

      const auth = getAuth();
      const fakePassword = "google_login_password";
      let user;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          fakePassword
        );

        user = userCredential.user;
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            fakePassword
          );
          user = userCredential.user;
        } else {
          throw error;
        }
      }

      const userRef = doc(db, "users", user.uid);
      const existingDoc = await getDoc(userRef);

      if (!existingDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name,
          email,
          thumbnail: photo,
          aboutMe: "",
          profession: "",
          createdAt: new Date(),
        });
      }

      fetch({
        id: user.uid,
        email,
        name,
        thumbnail: photo,
      });

      return router.push("/(tabs)/home");
    } catch (error: any) {
      console.log(error, "ERROR");
    }
  };

  return (
    <>
      <Container onPress={handleGoogleSignIn}>
        <Logo source={logo_google} />
      </Container>
    </>
  );
}
