import { FlatList } from "react-native";
import { Colors } from "@/constants/Colors";

import { Text } from "../../../../components/ui";

import { Container, Content, LinearGradientCustom, Thumbnail } from "./styles";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FontAwesome5 } from "@expo/vector-icons";
import { useUIDStore } from "@/store/useIDStore";
import { getUsersWithPriority } from "@/utils/getUsersWithPriority";
import { getAuth } from "firebase/auth";
import { getUserPosts } from "@/utils/getUserPosts";

interface ItemProps {
  id: string;
  title: string;
  thumbnail: string;
}

export default function Card() {
  const queryClient = useQueryClient();

  const { fetch, data } = useUIDStore();

  const auth = getAuth();

  const router = useRouter();

  const queryStoryUsers = useQuery({
    queryKey: ["userStoryByUID"],
    queryFn: () => getUsersWithPriority(auth.currentUser?.uid),
  });

  const queryUserPosts = useQuery({
    queryKey: ["userPosts"],
    queryFn: () => getUserPosts(data.uid),
  });

  const mutation = useMutation({
    mutationFn: getUserPosts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const handleRedirect = (id: string) => {
    mutation.mutate(data.uid);

    fetch({
      uid: id,
    });

    if (!!queryUserPosts.data?.length) {
      router.push("/(tabs)/profile");
    } else {
      router.push("/(story)");
    }
  };

  const Item = ({ id, title, thumbnail }: ItemProps) => (
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
