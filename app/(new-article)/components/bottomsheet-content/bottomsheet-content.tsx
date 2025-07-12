import { Input } from "@/components/ui";

import { useState } from "react";

import { Container, Row, Thumbnail } from "./styles";
import { FlatList, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type ItemProps = {
  image: string;
};

export default function BottomSheetContent({ onClose }) {
  const [value, setValue] = useState("");

  const DATA = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9zfGVufDB8fDB8fHww",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      image:
        "https://images.unsplash.com/photo-1599652521984-8bebed0580b7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvdG9zfGVufDB8fDB8fHww",
    },
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvdG9zfGVufDB8fDB8fHww",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      image:
        "https://images.unsplash.com/photo-1599652521984-8bebed0580b7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGhvdG9zfGVufDB8fDB8fHww",
    },
  ];

  const Item = ({ image }: ItemProps) => (
    <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
      <Thumbnail
        source={{
          uri: image,
        }}
      />
    </TouchableOpacity>
  );

  return (
    <Container>
      <Row>
        <TouchableOpacity onPress={onClose}>
          <AntDesign name="close" size={24} color={Colors.light.darkGray} />
        </TouchableOpacity>
      </Row>

      <Input
        value={value}
        onChangeText={(item) => setValue(item)}
        placeholder="Search"
        title=""
        keyboardType="default"
      />

      <FlatList
        data={DATA}
        numColumns={2}
        renderItem={({ item }) => <Item image={item.image} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}
