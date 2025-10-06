import React, { useMemo } from "react";
import { Alert, FlatList, ActivityIndicator, View, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Input } from "@/components/ui";
import {
  Container,
  ContentInput,
  Row,
  Thumbnail,
  Touchable,
  TouchableSkeleton,
  ButtonBack,
  RowItem,
} from "./styles";

type ItemProps = {
  id: string;
  image: string;
};

interface BottomSheetContentProps {
  onClose: () => void;
  data: ItemProps[];
  queryUnplash: string;
  onThumbnail: (item: string) => void;
  onEndReached: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  refetch: () => void;
}

export default function BottomSheetContent({
  onClose,
  data,
  queryUnplash,
  onThumbnail,
  onEndReached,
  isLoading,
  isLoadingMore,
  refetch,
}: BottomSheetContentProps) {
  // Memoriza os dados — evita recriar o array e resetar o scroll
  const memoizedData = useMemo(() => data ?? [], [data]);

  const Item = ({ id, image }: ItemProps) => (
    <Touchable
      activeOpacity={0.7}
      onPress={() => {
        onThumbnail(image);
        Alert.alert("Photo selected", "Your photo has been selected!", [
          { text: "OK" },
        ]);
      }}
    >
      <Thumbnail source={{ uri: image }} />
    </Touchable>
  );

  return (
    <Container>
      {/* Header */}
      <Row>
        <ButtonBack onPress={onClose}>
          <AntDesign name="close" size={24} color={Colors.light.darkGray} />
        </ButtonBack>
      </Row>

      {/* Input de busca */}
      <ContentInput>
        <Input
          title=""
          value={queryUnplash}
          onChangeText={() => {}}
          placeholder="Search"
          editable={false}
          keyboardType="twitter"
          errors={undefined}
        />
      </ContentInput>

      {/* FlatList sempre montada para manter a posição */}
      <FlatList
        data={memoizedData}
        numColumns={2}
        renderItem={({ item }) => <Item id={item.id} image={item.image} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          isLoading ? (
            // Skeleton loading durante o carregamento inicial
            <>
              {[1, 2, 3].map((row) => (
                <RowItem key={row}>
                  <TouchableSkeleton activeOpacity={0.7} />
                  <TouchableSkeleton activeOpacity={0.7} />
                </RowItem>
              ))}
            </>
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Nenhuma imagem encontrada.
            </Text>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ marginVertical: 20 }}>
              <ActivityIndicator size="large" color={Colors.light.blue} />
            </View>
          ) : null
        }
      />
    </Container>
  );
}
