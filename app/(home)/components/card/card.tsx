import { FlatList, View } from "react-native";
import { Colors } from "@/constants/Colors";

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

export default function Card() {
  const DATA = [
    {
      id: "1",
      title: "Emilio",
      image: thumbnail_1,
      category: category_1,
    },
    {
      id: "2",
      title: "Richard",
      image: thumbnail_2,
      category: category_2,
    },
    {
      id: "3",
      title: "Jasmine",
      image: thumbnail_3,
      category: category_3,
    },
    {
      id: "4",
      title: "Lucas",
      image: thumbnail_4,
      category: category_4,
    },
    {
      id: "5",
      title: "Hendrick",
      image: thumbnail_5,
      category: category_1,
    },
  ];

  const Item = ({ title, image, category }) => (
    <Content>
      <LinearGradientCustom>
        <Thumbnail source={image} />

        <CategoryIcon source={category} />
      </LinearGradientCustom>

      <Text
        title={title}
        fontFamily="regular"
        fontSize={14}
        color={Colors.light.blueText}
      />
    </Content>
  );

  return (
    <Container>
      <FlatList
        data={DATA}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Item
            title={item.title}
            image={item.image}
            category={item.category}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
}
