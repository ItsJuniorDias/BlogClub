import { ScrollView, StyleSheet } from "react-native";
import { useCallback, useRef, useState } from "react";
import axios from "axios";

import Toast from "react-native-toast-message";

import HeaderNewArticle from "../(new-article)/components/header/header";
import InputBody from "../(new-article)/components/input-body/input-body";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import BottomSheet from "@/components/ui/bottomsheet";
import BottomSheetContent from "../(new-article)/components/bottomsheet-content/bottomsheet-content";

const UNSPLASH_ACCESS_KEY = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg";

export default function NewArticle() {
  const [isLoading, setIsLoading] = useState(true);

  const [queryUnplash, setQueryUnplash] = useState();

  const [thumbnail, setThumbnail] = useState("");

  const bottomSheetRef = useRef(null);

  const searchPhotos = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${queryUnplash}&per_page=30&page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      return response.data;
    } catch (error) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      console.error("Erro ao buscar imagens:", error);
    }
  }, [queryUnplash]);

  const { data } = useQuery({
    queryKey: ["photos"],
    queryFn: searchPhotos,
  });

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNewArticle onPress={() => bottomSheetRef.current?.open()} />

        <InputBody thumbnail={thumbnail} setThumbnail={setThumbnail} />
      </ScrollView>

      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetContent
          data={data?.results}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onClose={() => bottomSheetRef.current?.close()}
          queryUnplash={queryUnplash}
          setQueryUnplash={setQueryUnplash}
          onThumbnail={(item: string) => setThumbnail(item)}
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
