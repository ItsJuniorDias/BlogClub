import { TouchableOpacity } from "react-native";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";

import profile_picture from "../../assets/images/profile_picture.png";

import { Text } from "../../components/ui";
import { Colors } from "@/constants/Colors";

import { useRouter } from "expo-router";

import {
  Container,
  ContentInfo,
  ContentText,
  Header,
  Row,
  Thumbnail,
} from "./styles";

export default function ArticleScreen() {
  const router = useRouter();

  return (
    <Container contentContainerStyle={{ paddingLeft: 40, paddingRight: 40 }}>
      <Header>
        <TouchableOpacity onPress={() => router.back()}>
          <SimpleLineIcons
            name="arrow-left"
            size={24}
            color={Colors.light.darkBlue}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Feather
            name="more-horizontal"
            size={32}
            color={Colors.light.darkBlue}
          />
        </TouchableOpacity>
      </Header>

      <Text
        title="Four Things Every Woman Needs To Know"
        fontFamily="semi-bold"
        fontSize={22}
        lineHeight={32}
        color={Colors.light.darkBlue}
      />

      <ContentInfo>
        <Row>
          <Thumbnail source={profile_picture} />

          <ContentText>
            <Text
              title="Richard Gervain"
              fontFamily="regular"
              fontSize={14}
              color={Colors.light.darkBlue}
            />

            <Text
              title="2m ago"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.darkGray}
            />
          </ContentText>
        </Row>

        <Row>
          <TouchableOpacity>
            <Feather name="send" size={24} color={Colors.light.blue} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Fontisto name="favorite" size={24} color={Colors.light.blue} />
          </TouchableOpacity>
        </Row>
      </ContentInfo>
    </Container>
  );
}
