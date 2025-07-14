import { StyleSheet, ScrollView } from "react-native";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useQuery } from "@tanstack/react-query";

import { Card, CarouselComponent } from "../(home)/components";
import { Header, LatestNews } from "@/components/ui";
import { useState } from "react";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);

  const fetch = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return dataList;
  };

  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch(),
  });

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.padding}
        style={styles.container}
      >
        <Header title="Hi, Alexandre!" description="Explore today’s" />

        <Card />

        <CarouselComponent />

        {data?.map((item, index) => (
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
            />
          </>
        ))}
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
