import { FlatList } from "react-native";
import { Colors } from "@/constants/Colors";

import { Text } from "../../../../components/ui";

import { Container, Content, LinearGradientCustom, Thumbnail } from "./styles";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { FontAwesome5 } from "@expo/vector-icons";
import { useUIDStore } from "@/store/useIDStore";
import { getUserPosts } from "@/utils/getUserPosts";
import { useCallback } from "react";

interface ItemProps {
  id: string;
  title: string;
  thumbnail: string;
}

export default function Card({ data }) {
  const queryClient = useQueryClient();

  const { fetch } = useUIDStore();

  const router = useRouter();

  const handleRedirect = useCallback(async (id: string) => {
    const result = await getUserPosts(id);

    console.log(id, "ID");

    fetch({
      uid: id,
    });

    if (result.length === 0) {
      router.push({
        pathname: "/(tabs)/profile",
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["userByUID"] });
        queryClient.invalidateQueries({ queryKey: ["getFollowing"] });
        queryClient.invalidateQueries({ queryKey: ["getFollowers"] });
        queryClient.invalidateQueries({ queryKey: ["repoData"] });
      }, 1000);
    } else {
      router.push("/(story)");
    }
  }, []);

  const Item = ({ id, title, thumbnail }: ItemProps) => (
    <>
      <Content onPress={() => handleRedirect(id)}>
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
    </>
  );

  return (
    <Container>
      <FlatList
        data={data}
        horizontal
        contentContainerStyle={{ paddingRight: 32 }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.name} thumbnail={item.thumbnail} />
        )}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
