import { Ionicons } from "@expo/vector-icons";
import { Container } from "./styles";
import { Colors } from "@/constants/Colors";

interface TabBarProps {
  onPress: () => void;
}

export default function TabBar({ onPress }: TabBarProps) {
  return (
    <Container onPress={onPress}>
      <Ionicons name="add" size={32} color={Colors.light.background} />
    </Container>
  );
}
