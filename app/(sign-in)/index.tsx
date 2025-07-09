import { Colors } from "@/constants/Colors";
import logo from "../../assets/images/logo_signin.png";

import { Text } from "../../components/ui";

import { Body, Container, Header, Logo, Tabs, Touchable } from "./styles";
import { useState } from "react";

export default function SignInScreen() {
  const [activeTab, setActiveTab] = useState({
    isActiveLogin: true,
    isActiveSignIn: false,
  });

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
              isActiveSignIn: false,
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
              isActiveSignIn: true,
            }))
          }
        >
          <Text
            title="SIGN UP"
            fontFamily="semi-bold"
            fontSize={18}
            color={Colors.light.background}
            style={{ opacity: activeTab.isActiveSignIn ? 1 : 0.3 }}
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
        />
      </Body>
    </Container>
  );
}
