import { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

import profile_picture from "../../assets/images/profile_picture.png";
import image_body from "../../assets/images/image_body.png";

import { Text } from "../../components/ui";
import { Colors } from "@/constants/Colors";

import { useRouter } from "expo-router";

import { useDataStore } from "@/store/useDataStore";

import {
  Body,
  BodyText,
  ButtonFloat,
  Container,
  ContentFloat,
  ContentInfo,
  ContentText,
  ContentTitle,
  Header,
  ImageBody,
  Row,
  Thumbnail,
} from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";

export default function ArticleScreen() {
  const queryClient = useQueryClient();

  const { currentUser } = getAuth();

  const data = useDataStore((state) => state.data);

  const [isLike, setIsLike] = useState(false);

  const router = useRouter();

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("thumbnail");

      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log(e);
    }
  };

  const query = useQuery({ queryKey: ["thumbnail"], queryFn: getData });

  const handleLiked = async () => {
    setIsLike((prevState) => !prevState);

    const postRef = doc(db, "posts", data.id);

    await updateDoc(postRef, {
      isLike: true,
      numberLike: increment(1),
    });

    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  return (
    <>
      <Container>
        <Header>
          <TouchableOpacity onPress={() => router.back()}>
            <SimpleLineIcons
              name="arrow-left"
              size={24}
              color={Colors.light.darkBlue}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Feather
              name="more-horizontal"
              size={32}
              color={Colors.light.darkBlue}
            />
          </TouchableOpacity>
        </Header>

        <ContentTitle>
          <Text
            title={data.title}
            fontFamily="semi-bold"
            fontSize={22}
            lineHeight={32}
            color={Colors.light.darkBlue}
          />
        </ContentTitle>

        <ContentInfo>
          <Row>
            <Thumbnail source={query.data} />

            <ContentText>
              <Text
                title="Alexandre Junior"
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.darkBlue}
              />

              <Text
                title="2m ago"
                fontFamily="regular"
                fontSize={12}
                color={Colors.light.darkGray}
              />
            </ContentText>
          </Row>

          <Row>
            <TouchableOpacity>
              <Feather name="send" size={24} color={Colors.light.blue} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Fontisto name="favorite" size={24} color={Colors.light.blue} />
            </TouchableOpacity>
          </Row>
        </ContentInfo>

        <Body>
          <ImageBody source={{ uri: data.thumbnail }} />

          <BodyText>
            <Text
              title={data.description}
              fontFamily="semi-bold"
              fontSize={18}
              color={Colors.light.darkBlue}
            />

            <Text
              title={data.article}
              fontFamily="regular"
              fontSize={14}
              lineHeight={20}
              color={Colors.light.blueText}
            />
          </BodyText>
        </Body>
      </Container>

      <ContentFloat>
        <ButtonFloat activeOpacity={0.7} onPress={() => handleLiked()}>
          <AntDesign
            name={isLike ? "like1" : "like2"}
            size={24}
            color="white"
          />

          <Text
            title={`${data.numberLike}`}
            fontFamily="regular"
            fontSize={16}
            color={Colors.light.background}
          />
        </ButtonFloat>
      </ContentFloat>
    </>
  );
}
