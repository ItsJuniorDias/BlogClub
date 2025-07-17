import { TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import { collection, getDocs } from "firebase/firestore";

import { ProgressBar, Text } from "../../components/ui";

import background_image from "../../assets/images/background_image.png";
import thumbnail_3 from "../../assets/images/thumbnail_3.png";
import AntDesign from "@expo/vector-icons/AntDesign";

import {
  Container,
  BackgroundImage,
  ContentBlur,
  ContentHeader,
  Thumbnail,
  ContentText,
  Row,
  ContentProgress,
  Footer,
  ContentButton,
  ContentLike,
} from "./styles";
import { StatusBar } from "expo-status-bar";
import { useUIDStore } from "@/store/useIDStore";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/firebaseConfig";

export default function StoryScreen() {
  const [progress, setProgress] = useState(0);

  const { data } = useUIDStore();

  const router = useRouter();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setProgress((prev) => (prev >= 1 ? 0 : prev + 0.01));
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, []);

  const getLastPostByUser = async (uid: string) => {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (!querySnapshot.empty) {
      const filterForeignKeyData = dataList.filter(
        (item) => item.foreign_key === uid
      );

      return filterForeignKeyData[filterForeignKeyData.length - 1];
    } else {
      console.log("No posts found for this user.");
      return null;
    }
  };

  const queryLastPost = useQuery({
    queryKey: ["lastPostByUser"],
    queryFn: () => getLastPostByUser(data.uid),
  });

  const getUser = async (uid: string) => {
    const querySnapshot = await getDocs(collection(db, "users"));

    const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (!querySnapshot.empty) {
      const filterForeignKeyData = dataList.find((item) => item.id === uid);

      return filterForeignKeyData;
    } else {
      console.log("No posts found for this user.");
      return null;
    }
  };

  const queryUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => getUser(data.uid),
  });

  return (
    <Container
      contentContainerStyle={{
        alignItems: "center",
      }}
    >
      <StatusBar style="light" />

      <ContentProgress>
        <ProgressBar progress={progress} color={Colors.light.blue} />
      </ContentProgress>

      <ContentHeader>
        <TouchableOpacity
          onPress={() => {
            router.push("/(tabs)/profile");
          }}
        >
          <Row>
            <Thumbnail source={queryUser?.data?.thumbnail} />

            <ContentText>
              <Text
                title={`${queryUser?.data?.name}`}
                fontFamily="semi-bold"
                fontSize={16}
                color="white"
              />

              <Text
                title={`4m ago`}
                fontFamily="regular"
                fontSize={14}
                color="white"
              />
            </ContentText>
          </Row>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="close" size={32} color="white" />
        </TouchableOpacity>
      </ContentHeader>

      <BackgroundImage
        source={queryLastPost?.data?.thumbnail}
      ></BackgroundImage>

      <ContentBlur intensity={30}>
        <Text
          title={`${queryLastPost?.data?.title}`}
          fontFamily="semi-bold"
          fontSize={18}
          numberOfLines={2}
          color="white"
        />

        <Text
          title={queryLastPost?.data?.article}
          fontFamily="regular"
          fontSize={14}
          numberOfLines={4}
          color="white"
        />
      </ContentBlur>

      <Footer>
        <View />

        <ContentButton>
          <Text
            title="Read More"
            fontFamily="semi-bold"
            fontSize={14}
            color={Colors.light.blue}
          />
        </ContentButton>

        <ContentLike onPress={() => {}}>
          <AntDesign name="heart" size={32} color={"#FF3743"} />

          <Text
            title="450k"
            fontFamily="semi-bold"
            fontSize={16}
            color={Colors.light.background}
          />
        </ContentLike>
      </Footer>
    </Container>
  );
}
