import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Colors } from "@/constants/Colors";

import logo from "../../assets/images/logo_signin.png";

import logo_google from "../../assets/images/logo_google.png";
import logo_facebook from "../../assets/images/logo_facebook.png";

import { Text, Input, Button } from "../../components/ui";

import {
  Body,
  Container,
  ContentButton,
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

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof schema>;

export default function SignInScreen() {
  const [activeTab, setActiveTab] = useState({
    isActiveLogin: true,
    isActiveSignIn: false,
  });

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Dados válidos:", data);
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
          style={{ marginBottom: 8 }}
        />

        <Input
          {...register("email")}
          onChangeText={(text) => setValue("email", text)}
          title="Username"
          placeholder="Enter with e-mail"
          keyboardType="email-address"
          errors={errors.email}
        />

        <Input
          {...register("password")}
          onChangeText={(text) => setValue("password", text)}
          title="Password"
          placeholder="Enter with password"
          keyboardType="visible-password"
          secureTextEntry
          errors={errors.password}
        />

        <ContentButton>
          <Button title="LOGIN" onPress={handleSubmit(onSubmit)} />
        </ContentButton>
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
            <TouchableOpacity onPress={() => {}}>
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
