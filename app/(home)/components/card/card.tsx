import { FlatList, View } from "react-native";
import { Colors } from "@/constants/Colors";

import { getAuth } from "firebase/auth";

import thumbnail_1 from "../../../../assets/images/thumbail_1.png";
import category_1 from "../../../../assets/images/category_1.png";

import thumbnail_2 from "../../../../assets/images/thumbnail_2.png";
import category_2 from "../../../../assets/images/category_2.png";

import thumbnail_3 from "../../../../assets/images/thumbnail_3.png";
import category_3 from "../../../../assets/images/category_3.png";

import thumbnail_4 from "../../../../assets/images/thumbnail_4.png";
import category_4 from "../../../../assets/images/category_4.png";

import thumbnail_5 from "../../../../assets/images/thumbnail_5.png";

import { Text } from "../../../../components/ui";

import {
  CategoryIcon,
  Container,
  Content,
  LinearGradientCustom,
  Thumbnail,
} from "./styles";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { queryStoryUserByUID } from "@/utils/queryStoryUserByUID";

export default function Card() {
  const [data, setData] = useState<DocumentData>([]);

  const { fetch } = useUserStore();

  const router = useRouter();

  const { currentUser } = getAuth();

  const queryUser = useQuery({
    queryKey: ["userByUID"],
    queryFn: () => queryStoryUserByUID(currentUser?.uid),
  });

  const Item = ({ title, thumbnail }) => (
    <Content onPress={() => router.push("/(story)")}>
      <LinearGradientCustom>
        <Thumbnail source={thumbnail} />
      </LinearGradientCustom>

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
        data={queryUser.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Item
            title={item.name}
            thumbnail={item.thumbnail}
            category={item.category}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
