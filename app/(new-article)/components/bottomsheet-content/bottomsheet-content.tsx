import { Input } from "@/components/ui";

import { useRef, useState } from "react";

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
  TouchableSkeleton,
} from "./styles";

type ItemProps = {
  item: {
    liked_by_user: boolean;
  };
  image: string;
};

interface BottomSheetContentProps {
  onClose: () => void;
  data: string[];
  isLoading: boolean;
}

export default function BottomSheetContent({
  data,
  onClose,
  isLoading,
}: BottomSheetContentProps) {
  const [value, setValue] = useState("");

  const [showGif, setShowGif] = useState(null);

  const handleLiked = (id: string) => {
    setShowGif(id);

    // setTimeout(() => setShowGif(null), 1500);
  };

  console.log(isLoading, "IS LOADING");
  console.log(data, "DATA");

  const Item = ({ id, item, image }: ItemProps) => {
    const showLikeGif = showGif === item.user.id;

    return (
      <>
        {isLoading && <TouchableSkeleton activeOpacity={0.7} />}

        {!isLoading && (
          <Touchable activeOpacity={0.7} onPress={() => handleLiked(id)}>
            <Thumbnail
              source={{
                uri: image,
              }}
            />

            {showLikeGif && <Checked source={success_checked} />}
          </Touchable>
        )}
      </>
    );
  };

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
        renderItem={({ item }) => (
          <Item id={item.user.id} item={item} image={item.links.download} />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        extraData={showGif}
      />
    </Container>
  );
}
