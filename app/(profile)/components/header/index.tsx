import { getAuth, signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../../../../components/ui";
import { Colors } from "@/constants/Colors";

import { useUserStore } from "@/store/useUserStore";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import {
  BorderContainer,
  ColumnInfo,
  Container,
  ContainerAbout,
  ContainerBody,
  ContainerInfo,
  Content,
  ContentInfo,
  ContentText,
  Row,
  Thumbnail,
} from "./styles";
import { useState } from "react";

interface HeaderProfileProps {
  title: string;
  icon: string;
}

export default function HeaderProfile({ title, icon }: HeaderProfileProps) {
  const [image, setImage] = useState<string | null>(null);

  const { data } = useUserStore();

  const auth = getAuth();

  const handleSignOut = async () => {
    return signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <Container>
        <Text
          title={title}
          fontFamily="semi-bold"
          fontSize={24}
          color={Colors.light.darkBlue}
        />

        <TouchableOpacity onPress={handleSignOut}>
          <MaterialIcons name={icon} size={32} color={Colors.light.darkBlue} />
        </TouchableOpacity>
      </Container>

      <Content>
        <ContainerBody style={styles.shadowBox}>
          <Row>
            <BorderContainer onPress={pickImage}>
              {image ? (
                <Thumbnail source={image} />
              ) : (
                <FontAwesome5 name="user" size={40} color="#333" />
              )}
            </BorderContainer>

            <ContentText>
              <Text
                title={data?._j?.email}
                numberOfLines={1}
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.blueText}
              />

              <Text
                title={data?._j?.name}
                numberOfLines={1}
                fontFamily="semi-bold"
                fontSize={18}
                color={Colors.light.darkBlue}
              />

              <Text
                title="Mobile Developer"
                numberOfLines={1}
                fontFamily="regular"
                fontSize={16}
                color={Colors.light.blue}
              />
            </ContentText>
          </Row>

          <ContainerAbout>
            <Text
              title="About me"
              fontFamily="semi-bold"
              fontSize={16}
              color={Colors.light.darkBlue}
            />

            <Text
              title="Working since the end of 2019 with frameworks such as React and React native, with experience managing global teams."
              fontFamily="regular"
              fontSize={14}
              lineHeight={20}
              color={Colors.light.blueText}
            />
          </ContainerAbout>
        </ContainerBody>
      </Content>

      <ContainerInfo>
        <ContentInfo>
          <ColumnInfo>
            <Text
              title="52"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Post"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>

          <ColumnInfo>
            <Text
              title="250"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Following"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>

          <ColumnInfo>
            <Text
              title="4.5K"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Followers"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>
        </ContentInfo>
      </ContainerInfo>
    </>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.01,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
