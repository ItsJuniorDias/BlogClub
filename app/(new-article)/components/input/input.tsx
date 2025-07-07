import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Tag, Text } from "@/components/ui";

import {
  Container,
  ContentTag,
  InputArticle,
  InputCustom,
  InputProduct,
  Row,
} from "./styles";

export default function Input() {
  const [text, onChangeText] = useState("");
  const [textProduct, onChangeTextProduct] = useState("");
  const [textArticle, onChangeTextArticle] = useState("");

  return (
    <Container>
      <InputCustom
        placeholder="The art of beign an artist"
        onChangeText={onChangeText}
        value={text}
      />

      <InputProduct
        placeholder="Simplified products"
        onChangeText={onChangeTextProduct}
        value={textProduct}
      />

      <ContentTag>
        <Row>
          <TouchableOpacity onPress={() => {}}>
            <Text
              title="Add Tags"
              fontFamily="semi-bold"
              fontSize={14}
              color={Colors.light.blue}
            />
          </TouchableOpacity>

          <Tag title="Art" />

          <Tag title="Design" />
        </Row>

        <Row>
          <Tag title="Culture" />

          <Tag title="Production" />
        </Row>
      </ContentTag>

      <InputArticle
        placeholder="Article Content"
        multiline={true}
        numberOfLines={10}
        onChangeText={onChangeTextArticle}
        value={textArticle}
        textAlignVertical="top"
      />
    </Container>
  );
}
