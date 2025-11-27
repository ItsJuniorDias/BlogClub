import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";

import { SkeletonNews, Text } from "@/components/ui";
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
import { useDataStore } from "@/store/useDataStore";
import { timeAgo } from "@/utils/timeAgo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

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
  foreign_key: string;
  type: "technology" | "adventure" | "philosophy";
  createdAt: Date;
  isMember: boolean;
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
  foreign_key,
  type,
  createdAt,
  isMember,
}: LatestNewsProps) {
  const fetch = useDataStore((state) => state.fetch);

  const router = useRouter();

  const [isMemberState, setIsMemberState] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      const result = await AsyncStorage.getItem("isMember");

      setIsMemberState(result === "true");
    };

    loadMember();
  }, [isMemberState]);

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
          </ContentText>
        )}

        {isLoading && <SkeletonNews />}

        {!isLoading && (
          <Body
            activeOpacity={0.7}
            disabled={false}
            onPress={() => {
              if (isMember && !isMemberState) {
                Alert.alert(
                  "Membership Required",
                  "You need to be a member to access this content.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "destructive",
                    },
                    {
                      text: "OK",
                      onPress: () => {
                        router.push("/(subscribe)");
                      },
                    },
                  ]
                );
              } else {
                fetch({
                  id,
                  isLike,
                  thumbnail: image,
                  title,
                  description,
                  article,
                  numberLike,
                  hours,
                  foreign_key,
                  type,
                  createdAt,
                });

                router.push("/(article)");
              }
            }}
          >
            <Thumbnail source={{ uri: image }} />

            {isMember && (
              <View style={styles.badge}>
                <Text
                  title="MEMBER"
                  fontFamily="semi-bold"
                  fontSize={10}
                  color="#fff"
                />
              </View>
            )}

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
                  <AntDesign name="like" size={16} color={Colors.light.blue} />

                  <Text
                    title={`${numberLike}k`}
                    fontFamily="regular"
                    fontSize={12}
                    color={Colors.light.darkBlue}
                  />
                </Row>

                <Row>
                  <AntDesign
                    name="clock-circle"
                    size={16}
                    color={Colors.light.blue}
                  />

                  <Text
                    title={`${timeAgo(createdAt)}`}
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
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#000000",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
});
