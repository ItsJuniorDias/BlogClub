import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { Colors } from "@/constants/Colors";
import { Text } from "../../../../components/ui";

import { Container } from "./styles";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function HeaderNewArticle() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  console.log(image, "IMAGE");

  return (
    <>
      <Container>
        <Text
          title={"New Article"}
          fontFamily="semi-bold"
          fontSize={24}
          color={Colors.light.darkBlue}
        />

        <TouchableOpacity onPress={pickImage}>
          <Feather name={"upload"} size={32} color={Colors.light.darkBlue} />
        </TouchableOpacity>
      </Container>
    </>
  );
}
