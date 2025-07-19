import { Text } from "../../ui";
import { Colors } from "@/constants/Colors";

import nofitication from "../../../assets/images/notification.png";

import { Container, Content, Notification } from "./styles";
import { TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  description: string;
}

export default function Header({ title, description }: HeaderProps) {
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

      {/* <TouchableOpacity onPress={() => {}}>
        <Notification source={nofitication} />
      </TouchableOpacity> */}
    </Container>
  );
}
