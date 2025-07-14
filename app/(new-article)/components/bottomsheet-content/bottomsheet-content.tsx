import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

import success_checked from "../../../../assets/images/success_checked.gif";

import { Input } from "@/components/ui";

import {
  Container,
  ContentInput,
  Row,
  Thumbnail,
  Checked,
  Touchable,
  TouchableSkeleton,
  ButtonBack,
} from "./styles";
import { useQueryClient } from "@tanstack/react-query";

type ItemProps = {
  id: string;
  image: string;
};

interface BottomSheetContentProps {
  onClose: () => void;
  data: ItemProps[];
  isLoading: boolean;
  setIsLoading: (item: boolean) => void;
  queryUnplash: string;
  setQueryUnplash: (item: string) => void;
  onThumbnail: (item: string) => void;
}

export default function BottomSheetContent({
  data,
  onClose,
  isLoading,
  setIsLoading,
  queryUnplash,
  setQueryUnplash,
  onThumbnail,
}: BottomSheetContentProps) {
  const queryClient = useQueryClient();

  const [likedItems, setLikedItems] = useState({});

  const toggleLike = (id) => {
    setLikedItems((prev) => {
      return {
        ...prev,
        [id]: !prev[id],
      };
    });
  };

  const Item = ({ id, image }: ItemProps) => {
    const liked = likedItems[id];

    return (
      <>
        {isLoading && <TouchableSkeleton activeOpacity={0.7} />}

        {!isLoading && (
          <Touchable
            activeOpacity={0.7}
            onPress={() => {
              toggleLike(id);

              onThumbnail(image);
            }}
          >
            <Thumbnail
              source={{
                uri: image,
              }}
            />

            {liked && <Checked source={success_checked} />}
          </Touchable>
        )}
      </>
    );
  };

  return (
    <Container>
      <Row>
        <ButtonBack onPress={onClose}>
          <AntDesign name="close" size={24} color={Colors.light.darkGray} />
        </ButtonBack>
      </Row>

      <ContentInput>
        <Input
          title={""}
          value={queryUnplash}
          onChangeText={(item) => {
            setIsLoading(true);

            setQueryUnplash(item.toLowerCase() ?? "");

            queryClient.invalidateQueries({ queryKey: ["photos"] });
          }}
          placeholder="Search"
          keyboardType="default"
          autoCapitalize="none"
          errors={undefined}
        />
      </ContentInput>

      <FlatList
        data={data}
        numColumns={2}
        refreshing
        renderItem={({ item }) => (
          <Item id={item.id} image={item.links.download} />
        )}
        keyExtractor={(item: ItemProps) => item.id}
        showsVerticalScrollIndicator={false}
        extraData={likedItems}
      />
    </Container>
  );
}
