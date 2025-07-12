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
}

const YOUR_ACCESS_TOKEN = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg";

export default function BottomSheetContent({
  data,
  onClose,
  isLoading,
}: BottomSheetContentProps) {
  const queryClient = useQueryClient();

  const [value, setValue] = useState("");

  const handleLiked = async (id: string) => {
    console.log(id, "ID");

    try {
      const response = await axios.post(
        `https://api.unsplash.com/photos/${id}/like`,
        {
          headers: {
            Authorization: `Bearer ${YOUR_ACCESS_TOKEN}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao dar like na imagem", error.message);
    }
  };

  const { mutate } = useMutation({
    mutationFn: handleLiked,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    },
  });

  console.log(isLoading, "IS LOADING");
  console.log(data, "DATA");

  const Item = ({ id, item, image }: ItemProps) => {
    return (
      <>
        {isLoading && <TouchableSkeleton activeOpacity={0.7} />}

        {!isLoading && (
          <Touchable activeOpacity={0.7} onPress={() => mutate(id)}>
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
          value={value}
          onChangeText={(item) => setValue(item)}
          placeholder="Search"
          keyboardType="default"
        />
      </ContentInput>

      <FlatList
        data={data}
        numColumns={2}
        renderItem={({ item }) => (
          <Item id={item.id} item={item} image={item.links.download} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
