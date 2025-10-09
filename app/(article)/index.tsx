import { useEffect, useState } from "react";
import { TouchableOpacity, Alert, StyleSheet, Platform } from "react-native";
import * as Sharing from "expo-sharing";

import mobileAds, {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

import * as Speech from "expo-speech";
import { Audio } from "expo-av";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";

import AntDesign from "@expo/vector-icons/AntDesign";

import { Text } from "../../components/ui";
import { Colors } from "@/constants/Colors";

import { useRouter } from "expo-router";

import { useDataStore } from "@/store/useDataStore";

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

const interstitialAdUnitId =
  Platform.OS === "android"
    ? "ca-app-pub-5426118153355097/5961430468"
    : "ca-app-pub-5426118153355097/9298040240";

const interstitial = InterstitialAd.createForAdRequest(interstitialAdUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

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

export default function ArticleScreen() {
  const [isPlay, setIsPlay] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const queryClient = useQueryClient();

  const { currentUser } = getAuth();

  const { data, fetch } = useDataStore((state) => state);

  const [isLike, setIsLike] = useState(data.isLike);

  const router = useRouter();

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => console.log("AdMob initialized"));

    let intervalId: NodeJS.Timeout;

    const showAdIfLoaded = () => {
      if (loaded) {
        interstitial.show();
        setLoaded(false); // marca como não carregado para recarregar o próximo
      }
    };

    // Listener quando o anúncio estiver carregado
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        showAdIfLoaded(); // mostra imediatamente ao carregar
      }
    );

    // Listener quando o anúncio for fechado
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        interstitial.load(); // prepara próximo anúncio
      }
    );

    // Carrega o primeiro anúncio
    interstitial.load();

    intervalId = setInterval(() => {
      showAdIfLoaded();
    }, 30000);

    // Cleanup ao desmontar
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      clearInterval(intervalId);
    };
  }, [loaded]);

  const handleAudio = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });
  };

  useEffect(() => {
    handleAudio();
  }, []);

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

  const handleDelete = async (uid: string) => {
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
          text: "Delete",
          style: "destructive",
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

  const handleSpeak = () => {
    setIsPlay(true);

    const thingToSay = data.article;

    if (!isPlay) {
      Speech.speak(thingToSay, {
        language: "en-US",
      });
    } else {
      Speech.stop();
      setIsPlay(false);
    }
  };

  return (
    <>
      <StatusBar style="dark" />

      <Container>
        <Header>
          <ButtonBack
            onPress={() => {
              router.back();
              Speech.stop();
            }}
          >
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
            <TouchableOpacity onPress={() => handleSpeak()}>
              <Feather
                name={!isPlay ? "play" : "pause"}
                size={24}
                color={Colors.light.blue}
              />
            </TouchableOpacity>
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
          <AntDesign name={isLike ? "like" : "like"} size={24} color="white" />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
