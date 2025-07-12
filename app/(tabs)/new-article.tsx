import { ScrollView, StyleSheet } from "react-native";
import { useRef, useState } from "react";
import axios from "axios";

import Toast from "react-native-toast-message";

import HeaderNewArticle from "../(new-article)/components/header/header";
import InputBody from "../(new-article)/components/input-body/input-body";
import { useQuery } from "@tanstack/react-query";

import BottomSheet from "@/components/ui/bottomsheet";
import BottomSheetContent from "../(new-article)/components/bottomsheet-content/bottomsheet-content";

const UNSPLASH_ACCESS_KEY = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg";

export default function NewArticle() {
  const [queryUnplash, setQueryUnplash] = useState("photos");

  const bottomSheetRef = useRef(null);

  const searchPhotos = async () => {
    const per_page = 30;

    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${queryUnplash}&per_page=50&page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["photos"],
    queryFn: searchPhotos,
  });

  console.log(data, "DATA");

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNewArticle onPress={() => bottomSheetRef.current?.open()} />

        <InputBody />
      </ScrollView>

      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetContent
          isLoading={isLoading}
          data={data?.results}
          onClose={() => bottomSheetRef.current?.close()}
        />
      </BottomSheet>
      <Toast />
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
