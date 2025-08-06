import { useState } from "react";
import { TouchableOpacity, Alert } from "react-native";
import * as Sharing from "expo-sharing";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";

import AntDesign from "@expo/vector-icons/AntDesign";

import { Text } from "../../components/ui";
import { Colors } from "@/constants/Colors";

import { useRouter } from "expo-router";

import { useDataStore } from "@/store/useDataStore";

import {
  Body,
  BodyText,
  ButtonBack,
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
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import { queryUserByUID } from "@/utils/queryUserByUID";
import { timeAgo } from "@/utils/timeAgo";

export default function ArticleScreen() {
  const queryClient = useQueryClient();

  const { currentUser } = getAuth();

  const { data, fetch } = useDataStore((state) => state);

  const [isLike, setIsLike] = useState(data.isLike);

  const router = useRouter();

  const query = useQuery({
    queryKey: ["userByUID"],
    queryFn: () => queryUserByUID(data.foreign_key),
  });

  const renderDelete = data.foreign_key === currentUser?.uid;

  const handleLiked = async () => {
    setIsLike((prevState) => !prevState);

    const likeDocRef = doc(db, `posts/${data.id}/likes`, currentUser?.uid);

    const postRef = doc(db, "posts", data.id);

    const likeDoc = await getDoc(likeDocRef);

    if (!likeDoc.data()?.liked) {
      fetch({
        ...data,
        numberLike: data.numberLike + 1,
      });

      await setDoc(likeDocRef, {
        liked: true,
      });

      await updateDoc(postRef, {
        isLike: true,
        numberLike: increment(1),
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } else {
      fetch({
        ...data,
        numberLike: data.numberLike - 1,
      });

      await setDoc(likeDocRef, { liked: false });

      await updateDoc(postRef, {
        isLike: false,
        numberLike: increment(-1),
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  };

  const handleDelete = async (uid) => {
    Alert.alert(
      "do you really want to delete the file?",
      "the article will be permanently deleted",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await deleteDoc(doc(db, "posts", uid));

            queryClient.invalidateQueries({ queryKey: ["posts"] });

            queryClient.invalidateQueries({ queryKey: ["repoData"] });

            router.back();
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="dark" />

      <Container>
        <Header>
          <ButtonBack onPress={() => router.back()}>
            <SimpleLineIcons
              name="arrow-left"
              size={24}
              color={Colors.light.darkBlue}
            />
          </ButtonBack>

          {renderDelete && (
            <TouchableOpacity onPress={() => handleDelete(data.id)}>
              <Feather
                name="more-horizontal"
                size={32}
                color={Colors.light.darkBlue}
              />
            </TouchableOpacity>
          )}
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
            <Thumbnail source={query?.data?.thumbnail} />

            <ContentText>
              <Text
                title={query?.data?.name}
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.darkBlue}
              />

              <Text
                title={`${timeAgo(data.createdAt)}`}
                fontFamily="regular"
                fontSize={12}
                color={Colors.light.darkGray}
              />
            </ContentText>
          </Row>

          <Row>
            <TouchableOpacity
              onPress={() => {
                Sharing.shareAsync("https://blogclub.dev.br/", {
                  dialogTitle: "Blog Club - App",
                });
              }}
            >
              <Feather name="send" size={24} color={Colors.light.blue} />
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
