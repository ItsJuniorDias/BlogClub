import { TouchableOpacity, StyleSheet } from "react-native";

import { Text } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import {
  Body,
  Container,
  ContentBody,
  ContentText,
  ContentTextBody,
  Row,
  Thumbnail,
} from "./styles";
import { useRouter } from "expo-router";

interface LatestNewsProps {
  isProfile?: boolean;
  profileTitle?: string;
  isLike?: boolean;
  image: string;
  title: string;
  description: string;
  numberLike: number;
  hours: number;
}

export default function LatestNews({
  isProfile,
  profileTitle,
  isLike,
  image,
  title,
  description,
  numberLike,
  hours,
}: LatestNewsProps) {
  const router = useRouter();

  return (
    <Container style={styles.shadowBox}>
      {!isProfile && (
        <ContentText>
          <Text
            title={profileTitle}
            fontFamily="semi-bold"
            fontSize={20}
            color={Colors.light.darkBlue}
          />

          <TouchableOpacity onPress={() => {}}>
            <Text
              title="More"
              fontFamily="regular"
              fontSize={14}
              color={Colors.light.blue}
            />
          </TouchableOpacity>
        </ContentText>
      )}

      <Body activeOpacity={0.7} onPress={() => router.push("/(article)")}>
        <Thumbnail source={image} />

        <ContentBody>
          <ContentTextBody>
            <Text
              title={title}
              fontFamily="semi-bold"
              fontSize={14}
              color={Colors.light.blue}
            />

            <Text
              title={description}
              fontFamily="regular"
              fontSize={14}
              color={Colors.light.darkBlue}
            />
          </ContentTextBody>

          <Row>
            <Row>
              <AntDesign name="like2" size={16} color={Colors.light.blue} />

              <Text
                title={`${numberLike}k`}
                fontFamily="regular"
                fontSize={12}
                color={Colors.light.darkBlue}
              />
            </Row>

            <Row>
              <AntDesign
                name="clockcircleo"
                size={16}
                color={Colors.light.blue}
              />

              <Text
                title={`${hours}hr ago`}
                fontFamily="regular"
                fontSize={12}
                color={Colors.light.darkBlue}
              />
            </Row>

            <Row>
              <MaterialIcons
                name={isLike ? "favorite" : "favorite-outline"}
                size={16}
                color={Colors.light.blue}
              />
            </Row>
          </Row>
        </ContentBody>
      </Body>
    </Container>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
  },
});
