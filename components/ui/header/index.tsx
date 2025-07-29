import { Text } from "../../ui";
import { Colors } from "@/constants/Colors";

import nofitication from "../../../assets/images/notification.png";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Container, Content, Notification } from "./styles";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { auth } from "@/firebaseConfig";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  const router = useRouter();

  const auth = getAuth();

  return (
    <Container>
      <Content>
        <Text
          title={title}
          fontFamily="regular"
          fontSize={18}
          color={Colors.light.blueText}
        />

        <Text
          title={description}
          fontFamily="semi-bold"
          fontSize={24}
          color={Colors.light.blueText}
        />
      </Content>

      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/(chat)", params: auth.currentUser?.uid })
        }
      >
        <Ionicons name="chatbox-outline" size={32} color="black" />
      </TouchableOpacity>
    </Container>
  );
}
