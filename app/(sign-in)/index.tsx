import { useEffect, useState, useRef } from "react";
import {
  Keyboard,
  Animated,
  Easing,
  Platform,
  TouchableOpacity,
} from "react-native";

import {
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";

import firebase from "firebase/app";
import { Colors } from "@/constants/Colors";

import logo from "../../assets/images/logo_signin.png";
import logo_google from "../../assets/images/logo_google.png";
import logo_facebook from "../../assets/images/logo_facebook.png";

import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "../../components/ui";

import InputLogin from "./components/input-login";
import InputSignUp from "./components/input-signup";
import {
  Body,
  Container,
  ContentFooter,
  Footer,
  Header,
  Logo,
  Row,
  RowAuth,
  Tabs,
  Touchable,
} from "./styles";

import AppleLogin from "./components/apple-login";
import GoogleLogin from "./components/google-login/index";
import { useRouter } from "expo-router";

const provider = new GoogleAuthProvider();

provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

provider.setCustomParameters({
  prompt: "select_account",
  login_hint: "itsjuniordias1997@gmail.com",
});

export default function SignInScreen() {
  const [activeTab, setActiveTab] = useState({
    isActiveLogin: true,
    isActiveSignUp: false,
  });

  const router = useRouter();

  // valor animado do movimento vertical
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Listener para quando o teclado abre
    const keyboardDidShowSub = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(shift, {
        toValue: -Math.min(e.endCoordinates.height * 0.6, 250), // altura máxima que vai subir
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    // Listener para quando o teclado fecha
    const keyboardDidHideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShowSub.remove();
      keyboardDidHideSub.remove();
    };
  }, []);

  return (
    <Animated.ScrollView
      contentContainerStyle={{
        paddingBottom: Keyboard.isVisible() ? 32 : 0,
      }}
      style={{
        flex: 1,
        transform: [{ translateY: shift }],
      }}
    >
      <Container>
        <Header>
          <Logo source={logo} />
        </Header>

        {/* Tabs de Login / Signup */}
        <Tabs>
          <Touchable
            onPress={() =>
              setActiveTab({
                isActiveLogin: true,
                isActiveSignUp: false,
              })
            }
          >
            <Text
              title="LOGIN"
              fontFamily="semi-bold"
              fontSize={18}
              color={Colors.light.background}
              style={{ opacity: activeTab.isActiveLogin ? 1 : 0.3 }}
            />
          </Touchable>

          <Touchable
            onPress={() =>
              setActiveTab({
                isActiveLogin: false,
                isActiveSignUp: true,
              })
            }
          >
            <Text
              title="SIGN UP"
              fontFamily="semi-bold"
              fontSize={18}
              color={Colors.light.background}
              style={{ opacity: activeTab.isActiveSignUp ? 1 : 0.3 }}
            />
          </Touchable>
        </Tabs>

        {/* Corpo do formulário */}
        <Body>
          <Text
            title="Welcome back"
            fontFamily="semi-bold"
            fontSize={24}
            color={Colors.light.darkBlue}
          />

          <Text
            title="Sign in with your account"
            fontFamily="regular"
            fontSize={14}
            color={Colors.light.darkBlue}
            lineHeight={40}
            style={{ marginBottom: 8 }}
          />

          {activeTab.isActiveLogin && <InputLogin />}

          {activeTab.isActiveSignUp && <InputSignUp />}
        </Body>

        {/* Rodapé */}
        <Footer>
          <Row>
            <Text
              title="Forgot your password?"
              fontFamily="regular"
              fontSize={14}
              color={Colors.light.darkBlue}
            />

            <TouchableOpacity onPress={() => router.push("/(forgot-password)")}>
              <Text
                title="Reset here"
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.blue}
              />
            </TouchableOpacity>
          </Row>

          <ContentFooter>
            <Text
              title="OR SIGN IN WITH"
              fontFamily="regular"
              fontSize={14}
              color={Colors.light.darkBlue}
            />

            <RowAuth>
              {Platform.OS !== "android" && <AppleLogin />}
              <GoogleLogin />
            </RowAuth>
          </ContentFooter>
        </Footer>
      </Container>
    </Animated.ScrollView>
  );
}
