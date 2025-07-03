import { Text } from "../../components/ui";

import background_image from "../../assets/images/background_image.png";

import { Container, BackgroundImage, ContentBlur } from "./styles";

export default function StoryScreen() {
  return (
    <Container
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
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
