import { Ionicons } from "@expo/vector-icons";
import { Container } from "./styles";
import { useUIDStore } from "@/store/useIDStore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

interface ButtonFloatProps {
  color: string;
  size: number;
}

export default function ButtonFloat({ color, size }: ButtonFloatProps) {
  const dataUID = useUIDStore();

  const auth = getAuth();

  const router = useRouter();

  const handleSetUID = () => {
    dataUID.fetch({
      uid: auth?.currentUser?.uid,
    });

    router.push("/(tabs)/profile");
  };

  return (
    <Container onPress={() => handleSetUID()}>
      <Ionicons name="person-outline" size={size} color={color} />
    </Container>
  );
}
