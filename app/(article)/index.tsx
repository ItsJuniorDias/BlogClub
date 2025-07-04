import { TouchableOpacity, StyleSheet } from "react-native";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Feather from "@expo/vector-icons/Feather";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";

import profile_picture from "../../assets/images/profile_picture.png";
import image_body from "../../assets/images/image_body.png";

import { Text } from "../../components/ui";
import { Colors } from "@/constants/Colors";

import { useRouter } from "expo-router";

import {
  Body,
  BodyText,
  ButtonFloat,
  Container,
  ContentFloat,
  ContentInfo,
  ContentText,
  ContentTitle,
  Header,
  ImageBody,
  Row,
  Thumbnail,
} from "./styles";
import { useState } from "react";

export default function ArticleScreen() {
  const [isLike, setIsLike] = useState(false);

  const router = useRouter();

  return (
    <>
      <Container>
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

        <ContentTitle>
          <Text
            title="Four Things Every Woman Needs To Know"
            fontFamily="semi-bold"
            fontSize={22}
            lineHeight={32}
            color={Colors.light.darkBlue}
          />
        </ContentTitle>

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

        <Body>
          <ImageBody source={image_body} />

          <BodyText>
            <Text
              title="A man’s sexuality is never your mind responsibility."
              fontFamily="semi-bold"
              fontSize={18}
              color={Colors.light.darkBlue}
            />

            <Text
              title="This one got an incredible amount of backlash the last time I said it, so I’m going to say it again: a man’s sexuality is never, ever your responsibility, under any circumstances. Whether it’s the fifth date or your twentieth year of marriage, the correct determining factor for whether or not you have sex with your partner isn’t whether you ought to “take care of him” or “put out” because it’s been a while or he’s really horny — the correct determining factor for whether or not you have sex is whether or not you want to have sex."
              fontFamily="regular"
              fontSize={14}
              lineHeight={20}
              color={Colors.light.blueText}
            />
          </BodyText>
        </Body>
      </Container>

      <ContentFloat>
        <ButtonFloat
          activeOpacity={0.7}
          onPress={() => setIsLike((prevState) => !prevState)}
        >
          <AntDesign
            name={isLike ? "like1" : "like2"}
            size={24}
            color="white"
          />

          <Text
            title="2.1k"
            fontFamily="regular"
            fontSize={16}
            color={Colors.light.background}
          />
        </ButtonFloat>
      </ContentFloat>
    </>
  );
}
