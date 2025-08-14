import { TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

import { collection, getDocs } from "firebase/firestore";

import { ProgressBar, Text } from "../../components/ui";

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
import { useDataStore } from "@/store/useDataStore";
import { getLastPostByUser } from "@/utils/getLastPostByUser";
import { queryUserByUID } from "@/utils/queryUserByUID";

export default function StoryScreen() {
  const [progress, setProgress] = useState(0);

  const { data } = useUIDStore();

  const fetch = useDataStore((state) => state.fetch);

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 1 ? 0 : prev + 0.01));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const queryLastPost = useQuery({
    queryKey: ["lastPostByUser"],
    queryFn: () => getLastPostByUser(data.uid),
  });

  const queryUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => queryUserByUID(data.uid),
  });

  console.log("Create branch to EAS generate builds");

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
            router.push({
              pathname: "/(tabs)/profile",
              params: {
                uid: data.uid,
              },
            });
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
        <ContentButton
          onPress={() => {
            fetch({
              id: queryLastPost.data?.id,
              isLike: false,
              thumbnail: queryLastPost.data.thumbnail,
              title: queryLastPost?.data?.title,
              description: queryLastPost?.data?.description,
              article: queryLastPost?.data?.article,
              numberLike: 0,
              hours: 0,
            });

            router.push("/(article)");
          }}
        >
          <Text
            title="Read More"
            fontFamily="semi-bold"
            fontSize={14}
            color={Colors.light.blue}
          />
        </ContentButton>
      </Footer>
    </Container>
  );
}
