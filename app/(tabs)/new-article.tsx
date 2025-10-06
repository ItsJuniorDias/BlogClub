import React, { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

import HeaderNewArticle from "../(new-article)/components/header/header";
import InputBody from "../(new-article)/components/input-body/input-body";
import BottomSheet from "@/components/ui/bottomsheet";
import BottomSheetContent from "../(new-article)/components/bottomsheet-content/bottomsheet-content";

const UNSPLASH_ACCESS_KEY = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg";

export default function NewArticle() {
  const [queryUnplash, setQueryUnplash] = useState("");
  const bottomSheetRef = useRef(null);
  const thumbnailRef = useRef("");

  // 🧠 Hook TanStack Query com paginação infinita
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["unsplashPhotos", queryUnplash],
    enabled: false,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      if (!queryUnplash) return { results: [], nextPage: null };

      try {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            queryUnplash
          )}&page=${pageParam}&per_page=30`,
          {
            headers: {
              Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        const formatted = response.data.results.map((item: any) => ({
          id: item.id,
          image: item.urls.small,
        }));

        return {
          results: formatted,
          nextPage: formatted.length > 0 ? pageParam + 1 : null,
        };
      } catch (err) {
        console.error("Erro na requisição Unsplash:", err);
        Toast.show({
          type: "error",
          text1: "Erro ao buscar imagens",
          text2: "Verifique sua conexão e tente novamente.",
        });
        return { results: [], nextPage: null };
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // 🔁 Junta todas as páginas em uma única lista
  const photos = useMemo(() => {
    return data?.pages?.flatMap((page) => page.results) ?? [];
  }, [data]);

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNewArticle
          onPress={() => {
            if (!queryUnplash) {
              Toast.show({
                type: "info",
                text1: "Digite algo para buscar imagens",
              });
              return;
            }

            (bottomSheetRef.current as any)?.open?.();
            refetch(); // 🔄 inicia busca com o termo atual
          }}
        />

        <InputBody
          thumbnail={thumbnailRef.current}
          setThumbnailRef={thumbnailRef}
          onChecked={(text) => setQueryUnplash(text)}
        />
      </ScrollView>

      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetContent
          data={photos}
          queryUnplash={queryUnplash}
          onClose={() => (bottomSheetRef.current as any)?.close?.()}
          onThumbnail={(uri: string) => (thumbnailRef.current = uri)}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage(); // 🚀 carrega próxima página
            }
          }}
          isLoading={isFetching}
          isLoadingMore={isFetchingNextPage}
          refetch={refetch}
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
    paddingTop: 64,
  },
});
