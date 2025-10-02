import { useEffect, useState } from "react";
import { Keyboard, Platform, TouchableOpacity } from "react-native";

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
  FakeKeyboard,
  Footer,
  Header,
  IconLogo,
  Logo,
  Row,
  RowAuth,
  Tabs,
  Touchable,
} from "./styles";
import { auth } from "@/firebaseConfig";
import AppleLogin from "./components/apple-login";
import GoogleLogin from "./components/google-login/index";
import { useRouter } from "expo-router";
import WebView from "react-native-webview";

const provider = new GoogleAuthProvider();

provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

provider.setCustomParameters({
  login_hint: "itsjuniordias1997@gmail.com",
});

export default function SignInScreen() {
  const [keyboardStatus, setKeyboardStatus] = useState("Keyboard Hidden");

  const [activeTab, setActiveTab] = useState({
    isActiveLogin: true,
    isActiveSignUp: false,
  });

  const router = useRouter();

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("keyboard-shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("keyboard-hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Container>
      <Header>
        <Logo source={logo} />
      </Header>

      <Tabs>
        <Touchable
          onPress={() =>
            setActiveTab((prevState) => ({
              ...prevState,
              isActiveLogin: true,
              isActiveSignUp: false,
            }))
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
            setActiveTab((prevState) => ({
              ...prevState,
              isActiveLogin: false,
              isActiveSignUp: true,
            }))
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

      {keyboardStatus === "keyboard-shown" && <FakeKeyboard />}
    </Container>
  );
}
