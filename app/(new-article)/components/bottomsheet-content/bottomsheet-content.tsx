import { Input } from "@/components/ui";

import { useState } from "react";

import { FlatList, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

import success_checked from "../../../../assets/images/success_checked.gif";

import {
  Container,
  ContentInput,
  Row,
  Thumbnail,
  Checked,
  Touchable,
  TouchableSkeleton,
} from "./styles";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ItemProps = {
  id: string;
  item: {
    liked_by_user: boolean;
  };
  image: string;
};

interface BottomSheetContentProps {
  onClose: () => void;
  data: string[];
  isLoading: boolean;
  setIsLoading: (item: boolean) => void;
  queryUnplash: string;
  setQueryUnplash: (item: string) => void;
}

const BEARER_TOKEN =
  "091343ce13c8ae780065ecb3b13dc903475dd22cb78a05503c2e0c69c5e98044";

export default function BottomSheetContent({
  data,
  onClose,
  isLoading,
  setIsLoading,
  queryUnplash,
  setQueryUnplash,
}: BottomSheetContentProps) {
  const queryClient = useQueryClient();

  const handleLiked = async (id: string) => {
    console.log(id, "ID");

    // try {
    //   const response = await axios.post(
    //     `https://api.unsplash.com/photos/${id}/like`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${BEARER_TOKEN}`,
    //       },
    //     }
    //   );

    //   return response.data;
    // } catch (error) {
    //   console.error("Erro ao dar like na imagem", error.message);
    // }
  };

  const { mutate } = useMutation({
    mutationFn: handleLiked,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  console.log(isLoading, "IS LOADING");

  const Item = ({ id, item, image }: ItemProps) => {
    return (
      <>
        {isLoading && <TouchableSkeleton activeOpacity={0.7} />}

        {!isLoading && (
          <Touchable activeOpacity={0.7} onPress={() => {}}>
            <Thumbnail
              source={{
                uri: image,
              }}
            />

            {item.liked_by_user && <Checked source={success_checked} />}
          </Touchable>
        )}
      </>
    );
  };

  return (
    <Container>
      <Row>
        <TouchableOpacity onPress={onClose}>
          <AntDesign name="close" size={24} color={Colors.light.darkGray} />
        </TouchableOpacity>
      </Row>

      <ContentInput>
        <Input
          value={queryUnplash}
          onChangeText={(item) => {
            setIsLoading(true);

            setQueryUnplash(item.toLowerCase() ?? "");

            mutate({});
          }}
          placeholder="Search"
          keyboardType="default"
          autoCapitalize="none"
        />
      </ContentInput>

      <FlatList
        data={data}
        numColumns={2}
        refreshing
        renderItem={({ item }) => (
          <Item id={item.id} item={item} image={item.links.download} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        extraData={data}
      />
    </Container>
  );
}
