import { Colors } from "@/constants/Colors";
import { Text } from "../../../../components/ui";

import { Container } from "./styles";
import { TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface HeaderNewArticleProps {
  pickImage: () => void;
}

export default function HeaderNewArticle({ pickImage }: HeaderNewArticleProps) {
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
