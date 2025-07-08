import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Tag, Text } from "@/components/ui";

import {
  Button,
  Container,
  ContentTag,
  InputArticle,
  InputCustom,
  InputProduct,
  Row,
} from "./styles";

interface InputProps {
  text: string;
  onChangeText: (item: string) => void;
  textProduct: string;
  onChangeTextProduct: (item: string) => void;
  textArticle: string;
  onChangeTextArticle: (item: string) => void;
  handleSubmit: () => void;
}

export default function Input({
  text,
  onChangeText,
  textProduct,
  onChangeTextProduct,
  textArticle,
  onChangeTextArticle,
  handleSubmit,
}: InputProps) {
  return (
    <Container>
      <InputCustom
        placeholder="The art of beign an artist"
        onChangeText={onChangeText}
        value={text}
        placeholderTextColor={Colors.light.darkBlue}
      />

      <InputProduct
        value={textProduct}
        onChangeText={onChangeTextProduct}
        placeholder="Simplified products"
        placeholderTextColor={Colors.light.darkBlue}
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
        placeholderTextColor={Colors.light.darkBlue}
        placeholder="Article Content"
        multiline={true}
        numberOfLines={10}
        onChangeText={onChangeTextArticle}
        value={textArticle}
        textAlignVertical="top"
      />

      <Button activeOpacity={0.7} onPress={handleSubmit}>
        <Text
          title="Create new post"
          fontFamily="semi-bold"
          fontSize={18}
          color={Colors.light.background}
        />
      </Button>
    </Container>
  );
}
