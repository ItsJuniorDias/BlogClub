import { useCallback, useState } from "react";
import { Alert, FlatList, ScrollView } from "react-native";
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
  RowItem,
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

  const Item = ({ id, image }: ItemProps) => {
    return (
      <>
        <Touchable
          activeOpacity={0.7}
          onPress={() => {
            onThumbnail(image);

            Alert.alert(
              "Photo selected with success",
              "Your photos by selected",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]
            );
          }}
        >
          <Thumbnail
            source={{
              uri: image,
            }}
          />
        </Touchable>
      </>
    );
  };

  return (
    <Container>
      <Row>
        <ButtonBack
          onPress={() => {
            onClose();

            setIsLoading(true);
          }}
        >
          <AntDesign name="close" size={24} color={Colors.light.darkGray} />
        </ButtonBack>
      </Row>

      <ContentInput>
        <Input
          title={""}
          value={queryUnplash}
          onChangeText={(item) => {
            setIsLoading(true);

            setQueryUnplash(item ?? "");

            queryClient.invalidateQueries({ queryKey: ["photos"] });
          }}
          placeholder="Search"
          keyboardType="default"
          autoCapitalize="none"
          errors={undefined}
        />
      </ContentInput>

      {isLoading && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <RowItem>
            <TouchableSkeleton activeOpacity={0.7} />
            <TouchableSkeleton activeOpacity={0.7} />
          </RowItem>

          <RowItem>
            <TouchableSkeleton activeOpacity={0.7} />
            <TouchableSkeleton activeOpacity={0.7} />
          </RowItem>

          <RowItem>
            <TouchableSkeleton activeOpacity={0.7} />
            <TouchableSkeleton activeOpacity={0.7} />
          </RowItem>
        </ScrollView>
      )}

      {!isLoading && (
        <FlatList
          data={data}
          numColumns={2}
          refreshing
          renderItem={({ item }) => (
            <Item id={item.id} image={item.links.download} />
          )}
          keyExtractor={(item: ItemProps) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Container>
  );
}
