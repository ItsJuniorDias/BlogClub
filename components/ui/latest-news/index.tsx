import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

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
  Skeleton,
  Thumbnail,
} from "./styles";
import { useRouter } from "expo-router";
import { useDataStore } from "@/store/useDataStore";

interface LatestNewsProps {
  id: string;
  isLoading: boolean;
  isProfile?: boolean;
  profileTitle?: string;
  isLike?: boolean;
  image: string;
  title: string;
  description: string;
  article: string;
  numberLike: number;
  hours: number;
}

export default function LatestNews({
  id,
  isLoading,
  isProfile,
  profileTitle,
  isLike,
  image,
  title,
  description,
  article,
  numberLike,
  hours,
}: LatestNewsProps) {
  const fetch = useDataStore((state) => state.fetch);

  const router = useRouter();

  return (
    <>
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

        {isLoading && <Skeleton />}

        {!isLoading && (
          <Body
            activeOpacity={0.7}
            onPress={() => {
              fetch({
                id,
                isLike,
                thumbnail: image,
                title,
                description,
                article,
                numberLike,
                hours,
              });

              router.push("/(article)");
            }}
          >
            <Thumbnail source={{ uri: image }} />

            <ContentBody>
              <ContentTextBody>
                <Text
                  title={title}
                  fontFamily="semi-bold"
                  fontSize={14}
                  numberOfLines={1}
                  color={Colors.light.blue}
                />

                <Text
                  title={description}
                  fontFamily="regular"
                  fontSize={14}
                  numberOfLines={2}
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
        )}
      </Container>
    </>
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
