import { Ionicons } from "@expo/vector-icons";
import { Container } from "./styles";
import { useUIDStore } from "@/store/useIDStore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

interface ButtonFloatProps {
  onPress: () => void;
  color: string;
  size: number;
}

export default function ButtonFloat({
  onPress,
  color,
  size,
}: ButtonFloatProps) {
  const dataUID = useUIDStore();

  const auth = getAuth();

  const router = useRouter();

  // const handleSetUID = () => {
  //   dataUID.fetch({
  //     uid: auth?.currentUser?.uid,
  //   });

  //   router.push("/(tabs)/profile");
  // };

  // const query = useQuery({ queryKey: ["setUID"], queryFn: handleSetUID });

  return (
    <Container onPress={() => onPress()}>
      <Ionicons name="person-outline" size={size} color={color} />
    </Container>
  );
}
