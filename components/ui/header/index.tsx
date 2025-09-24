import { Colors } from "@/constants/Colors";
import { Text } from "..";

import Ionicons from "@expo/vector-icons/Ionicons";

import { auth } from "@/firebaseConfig";
import { formatMyMessages } from "@/utils/formatMyMessages";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { TouchableOpacity } from "react-native";
import { Container, Content, ContentPointer, Pointer } from "./styles";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
  const router = useRouter();

  const { currentUser } = getAuth();

  const queryMyMessages = useQuery({
    queryKey: ["chatsMyMessages"],
    queryFn: formatMyMessages,
  });

  const conditionUserTarget = () => {
    if (!queryMyMessages.isLoading) {
      const result = queryMyMessages?.data[0]?.messages?.participants.indexOf(
        auth.currentUser?.uid
      );

      return result === 0 ? 0 : 1;
    }
  };

  const filterReadAt = () => {
    const result = queryMyMessages?.data?.filter(
      (item) => item.messages.readAt !== null
    );

    return !result?.length;
  };

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

      <ContentPointer>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(started-conversations)",
              params: {
                id: currentUser?.uid,
              },
            });
          }}
        >
          <Ionicons name="chatbox-outline" size={32} color="black" />
        </TouchableOpacity>

        {filterReadAt() && conditionUserTarget() === 0 && <Pointer />}
      </ContentPointer>
    </Container>
  );
}
