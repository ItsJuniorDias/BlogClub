import AntDesign from "@expo/vector-icons/AntDesign";

import { Colors } from "@/constants/Colors";
import { Text } from "..";

import { Button, Container } from "./styles";

interface TagProps {
  isChecked: boolean;
  onPress: (item: "technology" | "adventure") => void;
  title: "technology" | "adventure" | "philosophy";
}

export default function Tag({ isChecked, onPress, title }: TagProps) {
  return (
    <Container
      onPress={() => {
        onPress(title);
      }}
    >
      <Text
        title={title}
        fontFamily="semi-bold"
        fontSize={12}
        color={Colors.light.blue}
      />

      <Button disabled onPress={() => {}}>
        {isChecked && (
          <AntDesign name="check" size={18} color={Colors.light.background} />
        )}

        {!isChecked && (
          <AntDesign name="close" size={18} color={Colors.light.background} />
        )}
      </Button>
    </Container>
  );
}
