import { TouchableOpacity, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Colors } from "@/constants/Colors";

import { ProgressBar, Text } from "../../components/ui";

import background_image from "../../assets/images/background_image.png";
import thumbnail_3 from "../../assets/images/thumbnail_3.png";
import AntDesign from "@expo/vector-icons/AntDesign";

import {
  Container,
  BackgroundImage,
  ContentBlur,
  ContentHeader,
  Thumbnail,
  ContentText,
  Row,
  ContentProgress,
} from "./styles";

export default function StoryScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 1 ? 0 : prev + 0.01));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container
      contentContainerStyle={{
        alignItems: "center",
      }}
    >
      <ContentProgress>
        <ProgressBar progress={progress} color={Colors.light.blue} />
      </ContentProgress>

      <ContentHeader>
        <Row>
          <Thumbnail source={thumbnail_3} />

          <ContentText>
            <Text
              title={`Jasmine Levin`}
              fontFamily="semi-bold"
              fontSize={16}
              color="white"
            />

            <Text
              title={`4m ago`}
              fontFamily="regular"
              fontSize={14}
              color="white"
            />
          </ContentText>
        </Row>

        <TouchableOpacity onPress={() => {}}>
          <AntDesign name="close" size={32} color="white" />
        </TouchableOpacity>
      </ContentHeader>

      <BackgroundImage source={background_image}></BackgroundImage>

      <ContentBlur intensity={30}>
        <Text
          title={`Do You Want To Live A\nHappy Life? Smile.`}
          fontFamily="semi-bold"
          fontSize={18}
          color="white"
        />

        <Text
          title={`Sometimes there’s no reason to smile, but I’ll smile anyway because of life. Yes, I’m one of those people who always smiles.`}
          fontFamily="regular"
          fontSize={14}
          color="white"
        />
      </ContentBlur>
    </Container>
  );
}
