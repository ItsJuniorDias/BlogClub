import { FlatList } from "react-native";
import { Colors } from "@/constants/Colors";

import { Text } from "../../../../components/ui";

import { Container, Content, LinearGradientCustom, Thumbnail } from "./styles";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { queryAllUsers } from "@/utils/queryStoryUserByUID";
import { FontAwesome5 } from "@expo/vector-icons";
import { useUIDStore } from "@/store/useIDStore";

export default function Card() {
  const { fetch } = useUIDStore();

  const router = useRouter();

  const queryStoryUsers = useQuery({
    queryKey: ["userStoryByUID"],
    queryFn: queryAllUsers,
  });

  const Item = ({ id, title, thumbnail }) => (
    <Content
      onPress={() => {
        fetch({
          uid: id,
        });

        router.push("/(story)");
      }}
    >
      {thumbnail ? (
        <LinearGradientCustom>
          <Thumbnail source={thumbnail} />
        </LinearGradientCustom>
      ) : (
        <LinearGradientCustom>
          <FontAwesome5 name="user" size={24} color="#333" />
        </LinearGradientCustom>
      )}

      <Text
        title={title.split(" ")[0]}
        fontFamily="regular"
        fontSize={14}
        numberOfLines={1}
        color={Colors.light.blueText}
      />
    </Content>
  );

  return (
    <Container>
      <FlatList
        data={queryStoryUsers.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.name} thumbnail={item.thumbnail} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
