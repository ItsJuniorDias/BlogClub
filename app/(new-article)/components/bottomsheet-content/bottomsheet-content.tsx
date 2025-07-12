import { Input } from "@/components/ui";

import { useState } from "react";

import { FlatList, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

import success_checked from "../../../../assets/images/success_checked.gif";

import {
  Container,
  ContentInput,
  Row,
  Thumbnail,
  Checked,
  Touchable,
} from "./styles";

type ItemProps = {
  download: string;
};

interface BottomSheetContentProps {
  onClose: () => void;
  data: string[];
}

export default function BottomSheetContent({
  data,
  onClose,
}: BottomSheetContentProps) {
  const [value, setValue] = useState("");

  const Item = ({ image }: ItemProps) => (
    <Touchable activeOpacity={0.7} onPress={() => {}}>
      <Thumbnail
        source={{
          uri: image,
        }}
      />
    </Touchable>
  );

  return (
    <Container>
      <Row>
        <TouchableOpacity onPress={onClose}>
          <AntDesign name="close" size={24} color={Colors.light.darkGray} />
        </TouchableOpacity>
      </Row>

      <ContentInput>
        <Input
          value={value}
          onChangeText={(item) => setValue(item)}
          placeholder="Search"
          title=""
          keyboardType="default"
        />
      </ContentInput>

      <FlatList
        data={data}
        numColumns={2}
        renderItem={({ item }) => <Item image={item.links.download} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
