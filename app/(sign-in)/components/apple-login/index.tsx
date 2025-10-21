// AppleLoginFirebaseWithFallback.tsx
import React from "react";
import { Alert, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useUserStore } from "@/store/useUserStore";

import { getAuth, OAuthProvider, signInWithCredential } from "firebase/auth";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth();

export default function AppleLoginFirebaseWithFallback() {
  const { fetch } = useUserStore();
  const router = useRouter();

  const signInWithApple = async () => {
    try {
      // 1) pede o Apple sign-in
      const appleResp = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log(appleResp, "APPLE RESPONSE");

      // 2) garante que temos o identityToken (JWT). sem ele, não dá pra prosseguir com Firebase Auth.
      if (!appleResp.identityToken) {
        Alert.alert(
          "Erro",
          "Não foi possível obter o token da Apple (identityToken)."
        );
        return;
      }

      // 3) cria o credential do Firebase para apple.com
      const provider = new OAuthProvider("apple.com");
      const firebaseCredential = provider.credential({
        idToken: appleResp.identityToken,
        // authorizationCode: appleResp.authorizationCode, // opcional
      });

      // 4) autentica no Firebase (sign in or sign up)
      const userCredential = await signInWithCredential(
        auth,
        firebaseCredential
      );

      const firebaseUser = userCredential.user;

      // 5) montando email e nome:
      // - appleResp.email / appleResp.fullName vêm SOMENTE na primeira autorização do usuário
      // - depois, usamos firebaseUser.email / displayName ou dados salvos localmente
      let email = appleResp.email ?? firebaseUser.email ?? "";
      let name = "";

      // fullName vem como object (givenName/familyName) quando presente
      if (appleResp.fullName) {
        const g = appleResp.fullName.givenName ?? "";
        const f = appleResp.fullName.familyName ?? "";
        name = `${g} ${f}`.trim();
      } else if (firebaseUser.displayName) {
        name = firebaseUser.displayName;
      }

      // 6) fallback: se falta email ou nome, tenta recuperar do SecureStore (primeiro login)
      const saved = await SecureStore.getItemAsync("user_apple");
      if ((email === "" || name === "") && saved) {
        try {
          const parsed = JSON.parse(saved);
          email = email || parsed.email || "";
          name = name || parsed.name || "";
        } catch (e) {
          // ignore
        }
      }

      if (!email) {
        // Se ainda não tem email, interrompe (não é comum, mas pode acontecer em alguns fluxos)
        Alert.alert(
          "Erro",
          "Não foi possível obter o email do usuário. Tente novamente."
        );
        return;
      }

      // 7) atualiza o store local (Zustand / seu hook)
      fetch({
        id: firebaseUser.uid,
        email,
        name,
        thumbnail: firebaseUser.photoURL || "",
      });

      // 8) cria documento no Firestore apenas se não existir
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          id: firebaseUser.uid,
          email,
          name,
          thumbnail: firebaseUser.photoURL || "",
          createdAt: new Date(),
        });
      }

      // 9) salva localmente informações úteis para futuros logins (Apple só manda na 1ª vez)
      await SecureStore.setItemAsync(
        "user_apple",
        JSON.stringify({ uid: firebaseUser.uid, email, name })
      );

      // 10) navega
      router.push("/(tabs)/home");
    } catch (error: any) {
      if (error?.code === "ERR_CANCELED") {
        Alert.alert("Cancelado", "Usuário cancelou o login com Apple.");
      } else {
        console.error("Apple login error:", error);
        Alert.alert("Erro", error?.message ?? String(error));
      }
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={styles.button}
      onPress={signInWithApple}
    />
  );
}

const styles = StyleSheet.create({
  button: { width: 200, height: 44 },
});
