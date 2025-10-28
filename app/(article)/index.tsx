import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
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

import { franc } from "franc-min";

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
import { useUIDStore } from "@/store/useIDStore";
import { GlassView } from "expo-glass-effect";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ArticleScreen() {
  const [isPlay, setIsPlay] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const queryClient = useQueryClient();

  const { currentUser } = getAuth();

  const { data, fetch } = useDataStore((state) => state);

  const dataUID = useUIDStore();

  const [isLike, setIsLike] = useState(data.isLike);

  const router = useRouter();

  useEffect(() => {
    console.log("🚀 Iniciando AdMob + intervalo de 30s...");

    mobileAds()
      .initialize()
      .then(() => console.log("✅ AdMob initialized"));

    let intervalId: ReturnType<typeof setInterval>;
    let secondsElapsed = 0;
    let isLoaded = false;

    const showAdIfLoaded = () => {
      secondsElapsed += 60;
      console.log(`⏱️ ${secondsElapsed}s se passaram — verificando anúncio...`);

      if (isLoaded) {
        console.log("🎯 Anúncio carregado — exibindo agora!");
        interstitial.show();
        isLoaded = false;
        interstitial.load(); // carrega o próximo
      } else {
        console.log("🕓 Ainda não carregado, aguardando próximo ciclo...");
      }
    };

    // Listener: anúncio carregado
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log("📦 Anúncio carregado e pronto para exibir");
        isLoaded = true;
      }
    );

    // Listener: anúncio fechado
    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log("🔁 Anúncio fechado — recarregando próximo...");
        interstitial.load();
      }
    );

    // Carrega o primeiro anúncio
    interstitial.load();

    // Chama imediatamente e depois a cada 60 segundos
    showAdIfLoaded();

    intervalId = setInterval(showAdIfLoaded, 60000);

    // Cleanup ao desmontar
    return () => {
      clearInterval(intervalId);
      unsubscribeLoaded();
      unsubscribeClosed();
      console.log("🧹 Limpando intervalo e listeners do AdMob");
    };
  }, []);

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
    queryKey: ["userByArticleUID"],
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
    const text = data.article;

    if (!text) return;

    if (!isPlay) {
      setIsPlay(true);

      const langCode = franc(text);

      const langMap = {
        eng: "en-US",
        spa: "es-ES",
        por: "pt-BR",
        fra: "fr-FR",
        deu: "de-DE",
      };

      const language = langMap[langCode as keyof typeof langMap] ?? "en-US"; // fallback padrão

      Speech.speak(text, {
        language,
        pitch: 1.0,
        rate: 1.0,
        onDone: () => setIsPlay(false),
        onStopped: () => setIsPlay(false),
        onError: () => setIsPlay(false),
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
          <Pressable
            onPress={() => {
              queryClient.invalidateQueries({ queryKey: ["userByUID"] });

              router.back();
              Speech.stop();
            }}
          >
            <GlassView isInteractive glassEffectStyle="clear">
              <FontAwesome6
                name="chevron-left"
                size={24}
                color={Colors.light.darkBlue}
              />
            </GlassView>
          </Pressable>

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
          <Row
            onPress={() => {
              dataUID.fetch({ uid: data.foreign_key });

              router.push("/(tabs)/profile");
            }}
          >
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
