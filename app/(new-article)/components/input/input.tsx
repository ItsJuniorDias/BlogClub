import { useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Tag, Text, Button } from "@/components/ui";

import {
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
  isPending: boolean;
}

export default function Input({
  text,
  onChangeText,
  textProduct,
  onChangeTextProduct,
  textArticle,
  onChangeTextArticle,
  handleSubmit,
  isPending,
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

      <Button
        isLoading={isPending}
        title="CREATE NEW POST"
        onPress={handleSubmit}
      />
    </Container>
  );
}
