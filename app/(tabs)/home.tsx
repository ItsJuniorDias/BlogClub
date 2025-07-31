import { StyleSheet, ScrollView, FlatList } from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Card, CarouselComponent } from "../(home)/components";
import { Header, LatestNews } from "@/components/ui";
import { useCallback, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { queryUserByUID } from "@/utils/queryUserByUID";
import { useLinkingURL, useURL } from "expo-linking";

export default function HomeScreen() {
  const queryClient = useQueryClient();

  const [snapToItem, setSnapToItem] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const url = useLinkingURL();

  const user = getAuth();

  const queryUser = useQuery({
    queryKey: ["user"],
    queryFn: () => queryUserByUID(user?.currentUser?.uid),
  });

  const fetch = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
      id: doc.id,
      ...doc.data(),
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

    if (snapToItem === 0) {
      return filterDataTechnology;
    }

    if (snapToItem === 1) {
      return filterDataAdventure;
    }

    if (snapToItem === 2) {
      return filterDataPhilosophy;
    }
  }, [snapToItem]);

  const { data, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch(),
  });

  const renderItem = useCallback(
    ({ item, index }) => (
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
      />
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
          title={`Hi, ${queryUser?.data?.name ?? "Everyone"}!`}
          description="Explore today’s"
        />

        <Card />

        <CarouselComponent
          onSnapToItem={(item) => {
            setSnapToItem(item);

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
    paddingBottom: 96,
  },
});
