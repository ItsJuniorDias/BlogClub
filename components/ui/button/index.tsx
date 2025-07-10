import { ActivityIndicator, TouchableOpacityProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { Text } from "../../ui";

import { Container } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  isLoading: boolean;
}

export default function Button({ title, onPress, isLoading }: ButtonProps) {
  return (
    <Container onPress={onPress} activeOpacity={0.7}>
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.light.background} />
      ) : (
        <Text
          title={title}
          fontFamily="semi-bold"
          fontSize={16}
          color={Colors.light.background}
        />
      )}
    </Container>
  );
}
