import { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
  Pressable,
  View,
  Animated,
} from "react-native";
import * as Sharing from "expo-sharing";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { Button, ContextMenu, Host, Picker } from "@expo/ui/swift-ui";
import { ContextMenu as ContextMenuAndroid } from "@expo/ui/jetpack-compose";

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
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/firebaseConfig";
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

import { useUIDStore } from "@/store/useIDStore";
import { GlassView } from "expo-glass-effect";
import { FontAwesome6 } from "@expo/vector-icons";

const genAI = new GoogleGenerativeAI("");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
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

function Skeleton({ width = "100%", height = 14, style = {} }) {
  const animation = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animation.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200], // movimento horizontal
  });

  return (
    <View style={[styles.skeleton, { width, height }, style]}>
      <Animated.View
        style={[styles.shimmer, { transform: [{ translateX }] }]}
      />
    </View>
  );
}

function SkeletonParagraph() {
  return (
    <View style={{ marginTop: 10 }}>
      <Skeleton width="100%" />
      <Skeleton width="92%" />
      <Skeleton width="85%" />
      <Skeleton width="100%" />
      <Skeleton width="90%" />
    </View>
  );
}

export default function ArticleScreen() {
  const [isPlay, setIsPlay] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loaded, setLoaded] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);

  const queryClient = useQueryClient();

  const { currentUser } = getAuth();

  const { data, fetch } = useDataStore((state) => state);

  const [translatedText, setTranslatedText] = useState({
    title: data.title,
    description: data.description,
    article: data.article,
  });

  const dataUID = useUIDStore();

  const [isLike, setIsLike] = useState(data.isLike);

  const router = useRouter();

  useEffect(() => {
    console.log("🚀 Iniciando AdMob + intervalo de 30s...");

    if (Platform.OS === "ios") return;

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

  async function translateText(text: string, target = "pt") {
    const prompt = `
    Translate the following text to ${target}.
    Return only the translated text.
    Text: "${text}"
  `;

    let attempts = 3;

    while (attempts > 0) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error: any) {
        console.log("Translation error:", error);

        // erro 503 = servidor sobrecarregado
        if (error.toString().includes("503")) {
          attempts--;
          console.log("⚠️ Model overloaded — retrying...");
          await new Promise((res) => setTimeout(res, 1200)); // espera 1.2s
        } else {
          throw error; // erro real → deve mostrar alerta
        }
      }
    }

    Alert.alert(
      "Translation unavailable",
      "The translation service is overloaded. Please try again in a few seconds."
    );

    return text; // fallback: retorna o original
  }

  async function handleTranslateAll(targetLanguage: string) {
    setIsTranslating(true); // inicia skeleton

    try {
      const newTitle = await translateText(data.title, targetLanguage);
      const newDescription = await translateText(
        data.description,
        targetLanguage
      );
      const newArticle = await translateText(data.article, targetLanguage);

      setTranslatedText({
        title: newTitle || data.title,
        description: newDescription || data.description,
        article: newArticle || data.article,
      });
    } catch (e) {
      console.log("Translation Error:", e);
      setIsTranslating(false);
    }

    setIsTranslating(false);
  }

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

  const reportContent = async ({
    reportedId,
    reportedType, // e.g. "post", "comment", "user"
    reason,
    details = "",
  }: {
    reportedId: string;
    reportedType: string;
    reason: string;
    details?: string;
  }) => {
    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "reports"), {
        reporterId: user ? user.uid : "anonymous",
        reportedId,
        reportedType,
        reason,
        details,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Report submitted successfully");

      Alert.alert("Thank you", "Your report has been submitted.");

      return { success: true };
    } catch (error) {
      console.error("❌ Error submitting report:", error);
      return { success: false, error };
    }
  };

  const renderContextMenu = () => {
    return (
      <>
        <Host style={{ width: 150, height: 50 }}>
          <ContextMenu>
            <ContextMenu.Items>
              {currentUser?.uid === data.foreign_key && (
                <Button
                  systemImage="xmark"
                  onPress={() => handleDelete(data.id)}
                >
                  Delete
                </Button>
              )}

              <Button
                systemImage="flag"
                onPress={() =>
                  reportContent({
                    reportedId: data.id,
                    reportedType: "post",
                    reason: "Inappropriate content",
                  })
                }
              >
                Report
              </Button>

              <Picker
                label="Translate"
                options={[
                  "English",
                  "Spanish",
                  "Portuguese",
                  "French",
                  "Chinese",
                  "Hindi",
                ]}
                variant="menu"
                selectedIndex={selectedIndex}
                onOptionSelected={({ nativeEvent: { index } }) => {
                  setSelectedIndex(index);

                  if (index === 0) {
                    handleTranslateAll("en");
                  }

                  if (index === 1) {
                    handleTranslateAll("es");
                  }

                  if (index === 2) {
                    handleTranslateAll("pt");
                  }

                  if (index === 3) {
                    handleTranslateAll("fr");
                  }

                  if (index === 4) {
                    handleTranslateAll("zh");
                  }

                  if (index === 5) {
                    handleTranslateAll("hi");
                  }
                }}
              />
            </ContextMenu.Items>

            <ContextMenu.Trigger>
              <Button variant="bordered">Show Menu</Button>
            </ContextMenu.Trigger>
          </ContextMenu>
        </Host>
      </>
    );
  };

  const handleSpeak = () => {
    const text = translatedText.article;

    if (!text) return;

    if (!isPlay) {
      setIsPlay(true);

      const langCode = franc(text);

      const langMap = {
        eng: "en-US",
        spa: "es-ES",
        por: "pt-BR",
        fra: "fr-FR",
        cmn: "zh-CN",
        hin: "hi-IN",
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
            <GlassView
              style={styles.buttonBack}
              isInteractive
              glassEffectStyle="clear"
            >
              <FontAwesome6
                name="chevron-left"
                size={24}
                color={Colors.light.darkBlue}
              />
            </GlassView>
          </Pressable>

          {renderDelete && Platform.OS === "android" ? (
            <View style={{ marginRight: 24 }}>
              <TouchableOpacity onPress={() => handleDelete(data.id)}>
                <Feather
                  name="more-horizontal"
                  size={32}
                  color={Colors.light.darkBlue}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <>{renderContextMenu()}</>
          )}
        </Header>

        <ContentTitle>
          {isTranslating ? (
            <Skeleton width="70%" height={28} />
          ) : (
            <Text
              title={translatedText.title}
              fontFamily="semi-bold"
              fontSize={22}
              lineHeight={32}
              color={Colors.light.darkBlue}
            />
          )}
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
            {isTranslating ? (
              <SkeletonParagraph />
            ) : (
              <Text
                title={translatedText.description}
                fontFamily="semi-bold"
                fontSize={18}
                color={Colors.light.darkBlue}
              />
            )}

            {isTranslating ? (
              <SkeletonParagraph />
            ) : (
              <Text
                title={translatedText.article}
                fontFamily="regular"
                fontSize={14}
                lineHeight={20}
                color={Colors.light.blueText}
              />
            )}
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
  skeleton: {
    backgroundColor: "#C0C0C0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  shimmer: {
    width: "40%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    opacity: 0.5,
  },
  buttonBack: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginLeft: -16,
  },
});
