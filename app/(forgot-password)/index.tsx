import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebaseConfig";

import { Text } from "../../components/ui";
import { Colors } from "@/constants/Colors";
import { Container } from "./styles";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, preencha o e-mail.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Sucesso", `Link de redefinição enviado para ${email}`);
      setEmail("");
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      let message = "Erro ao enviar o link.";
      if (error.code === "auth/user-not-found")
        message = "Usuário não encontrado.";
      else if (error.code === "auth/invalid-email")
        message = "E-mail inválido.";

      Alert.alert("Erro", message);
    }

    // Aqui você pode chamar sua API para resetar a senha
    Alert.alert(
      "Email enviado",
      `Um link de redefinição foi enviado para ${email}`
    );
    setEmail("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Ionicons
        name="lock-closed-outline"
        size={64}
        color={Colors.light.blue}
        style={styles.icon}
      />

      <Container>
        <Text
          title="Forgot your password?"
          fontFamily="semi-bold"
          color={Colors.light.darkBlue}
          fontSize={24}
        />

        <Text
          title="Enter your email below to receive a password reset link."
          fontFamily="regular"
          color={Colors.light.darkGray}
          fontSize={14}
          style={{ textAlign: "center" }}
        />
      </Container>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text
          title="Send"
          fontFamily="semi-bold"
          fontSize={16}
          color={Colors.light.background}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => router.back()}>
        <Text
          title="To go back"
          fontFamily="semi-bold"
          fontSize={16}
          color={Colors.light.darkBlue}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: Colors.light.blue,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    elevation: 2,
  },
  buttonBack: {
    marginTop: 24,
  },
});
