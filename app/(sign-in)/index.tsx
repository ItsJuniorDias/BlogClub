import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { Colors } from "@/constants/Colors";

import logo from "../../assets/images/logo_signin.png";
import logo_google from "../../assets/images/logo_google.png";
import logo_facebook from "../../assets/images/logo_facebook.png";

import { Text } from "../../components/ui";
import InputLogin from "./components/input-login";
import InputSignUp from "./components/input-signup";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
} from "firebase/auth";

import { auth } from "@/firebaseConfig";

import {
  Body,
  Container,
  ContentFooter,
  Footer,
  Header,
  IconLogo,
  Logo,
  Row,
  RowAuth,
  Tabs,
  Touchable,
} from "./styles";

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  webClientId:
    "482652111919-76uujj9k419b62iru3l5hfrv92nb8tfv.apps.googleusercontent.com",
  iosClientId:
    "482652111919-rf1smagh2da9adn247c21d7q226qp712.apps.googleusercontent.com",
});

export default function SignInScreen() {
  const [activeTab, setActiveTab] = useState({
    isActiveLogin: true,
    isActiveSignUp: false,
  });

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // google services are available
    } catch (err) {
      console.error("play services are not available");
    }
  };

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

          <TouchableOpacity onPress={() => {}}>
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
            <TouchableOpacity onPress={handleGoogleSignin}>
              <IconLogo source={logo_google} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}}>
              <IconLogo source={logo_facebook} />
            </TouchableOpacity>
          </RowAuth>
        </ContentFooter>
      </Footer>
    </Container>
  );
}
