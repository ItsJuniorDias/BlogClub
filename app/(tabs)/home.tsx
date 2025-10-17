import { FlatList, Platform, ScrollView, StyleSheet, View } from "react-native";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CarouselComponent } from "../(home)/components";
import { Header, LatestNews } from "../../components/ui";
import { queryUserByUID } from "../../utils/queryUserByUID";
import { getUsersWithPriority } from "../../utils/getUsersWithPriority";

import mobileAds, {
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";

interface ItemProps {
  item: {
    id: string;
    thumbnail: string;
    title: string;
    description: string;
    article: string;
    numberLike: number;
    hours: number;
    isLike: boolean;
    foreign_key: string;
    type: "technology" | "adventure" | "philosophy";
    createdAt: Date;
  };
  index: number;
}

const adUnitId = "ca-app-pub-5426118153355097/5727493102";

export default function HomeScreen() {
  const queryClient = useQueryClient();
  const auth = getAuth();
  const snapToItemRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const user = getAuth();

  // 🔹 Inicializa o AdMob ao abrir o app
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => console.log("AdMob inicializado"));
  }, []);

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: () => queryUserByUID(user?.currentUser?.uid),
  });

  const queryStoryUsers = useQuery({
    queryKey: ["userStoryByUID"],
    queryFn: () => getUsersWithPriority(auth.currentUser?.uid),
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["chatsMyMessages"] });
  }, [queryClient]);

  const handleFetch = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
      id: doc.id,
      ...(doc.data() as {
        thumbnail: string;
        title: string;
        description: string;
        article: string;
        numberLike: number;
        hours: number;
        isLike: boolean;
        foreign_key: string;
        type: "technology" | "adventure" | "philosophy";
        createdAt: Date;
      }),
    }));

    const filterDataTechnology = dataList.filter(
      (item) => item.type === "technology"
    );
    const filterDataAdventure = dataList.filter(
      (item) => item.type === "adventure"
    );
    const filterDataPhilosophy = dataList.filter(
      (item) => item.type === "philosophy"
    );

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    if (snapToItemRef.current === 0) return filterDataTechnology;
    if (snapToItemRef.current === 1) return filterDataAdventure;
    if (snapToItemRef.current === 2) return filterDataPhilosophy;
  }, []);

  const { data, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => handleFetch(),
  });

  // 🔹 Renderiza cada item + banner a cada 5
  const renderItem = useCallback(
    ({ item, index }: ItemProps) => (
      <>
        <LatestNews
          id={item.id}
          isLoading={isLoading}
          isProfile={index !== 0}
          profileTitle="Latest News"
          image={item.thumbnail}
          title={item.title}
          description={item.description}
          article={item.article}
          numberLike={item.numberLike}
          hours={item.hours}
          isLike={item.isLike}
          foreign_key={item.foreign_key}
          type={item.type}
          createdAt={item.createdAt}
        />

        {/* ✅ Banner a cada 5 itens */}
        {(index + 1) % 5 === 0 && (
          <View style={styles.bannerContainer}>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        )}
      </>
    ),
    [isLoading]
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.padding}
        style={styles.container}
      >
        <Header
          title={`Hi, ${
            (queryUser?.data as { name?: string })?.name ?? "Everyone"
          }!`}
          description="Explore today’s"
        />

        <Card data={queryStoryUsers.data} />

        <CarouselComponent
          onSnapToItem={(item) => {
            snapToItemRef.current = item;
            refetch();
          }}
        />

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  padding: {
    paddingBottom: Platform.OS === "android" ? 96 : 0,
  },
  bannerContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
});
