import AntDesign from "@expo/vector-icons/AntDesign";

import { Colors } from "@/constants/Colors";
import { Text } from "../../ui";

import { Container, Button } from "./styles";

interface TagProps {
  title: string;
}

export default function Tag({ title }: TagProps) {
  return (
    <Container>
      <Text
        title={title}
        fontFamily="semi-bold"
        fontSize={12}
        color={Colors.light.blue}
      />

      <Button>
        <AntDesign name="close" size={18} color={Colors.light.background} />
      </Button>
    </Container>
  );
}
