import { getAuth, signOut } from "firebase/auth";

import * as ImagePicker from "expo-image-picker";

import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Text } from "../../../../components/ui";
import { Colors } from "@/constants/Colors";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

import { queryUserByUID } from "@/utils/queryStoryUserByUID";
import { useUIDStore } from "@/store/useIDStore";

import {
  BorderContainer,
  ButtonFollow,
  ColumnInfo,
  Container,
  ContainerAbout,
  ContainerBody,
  ContainerInfo,
  Content,
  ContentInfo,
  ContentText,
  Row,
  Thumbnail,
} from "./styles";
import { useState } from "react";

interface HeaderProfileProps {
  title: string;
  icon: string;
  posts: number;
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqazdrinu/upload";
const UPLOAD_PRESET = "expo-upload";

export default function HeaderProfile({
  title,
  icon,
  posts,
}: HeaderProfileProps) {
  const [isFollow, setFollow] = useState(false);

  const queryClient = useQueryClient();

  const auth = getAuth();

  const dataUID = useUIDStore();

  console.log(dataUID.data, "DATA PROFILE UID");

  const queryPosts = !!dataUID.data.uid
    ? dataUID.data.uid
    : auth.currentUser?.uid;

  const { data } = useQuery({
    queryKey: ["userByUID"],
    queryFn: () => queryUserByUID(queryPosts),
  });

  const handleSignOut = async () => {
    return signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];

      const fileUri = image.uri;

      const fileName = fileUri.split("/").pop();
      const fileType = image.type || "image/jpeg";

      uploadImageToCloudinary({
        fileUri,
        fileName,
        fileType,
      });
    }
  };

  const uploadImageToCloudinary = async ({ fileUri, fileName, fileType }) => {
    const data = new FormData();

    data.append("file", {
      uri: fileUri,
      type: fileType,
      name: fileName,
    });

    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: data,
    });

    const result = await res.json();

    const userRef = doc(db, "users", auth.currentUser?.uid);

    await updateDoc(userRef, {
      thumbnail: result.url,
    });

    queryClient.invalidateQueries({ queryKey: ["userByUID"] });

    return result.url;
  };

  const mutation = useMutation({
    mutationFn: pickImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["thumbnail"] });
    },
  });

  return (
    <>
      <Container>
        <Text
          title={title}
          fontFamily="semi-bold"
          fontSize={24}
          color={Colors.light.darkBlue}
        />

        <TouchableOpacity onPress={handleSignOut}>
          <MaterialIcons name={icon} size={32} color={Colors.light.darkBlue} />
        </TouchableOpacity>
      </Container>

      <Content>
        <ContainerBody style={styles.shadowBox}>
          <Row>
            <BorderContainer onPress={() => mutation.mutate({})}>
              {mutation?.isPending ? (
                <>
                  <ActivityIndicator size="small" color={Colors.light.blue} />
                </>
              ) : (
                <>
                  {!!data?.thumbnail ? (
                    <Thumbnail source={data?.thumbnail} />
                  ) : (
                    <FontAwesome5 name="user" size={40} color="#333" />
                  )}
                </>
              )}
            </BorderContainer>

            <ContentText>
              <Text
                title={data?.email}
                numberOfLines={1}
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.blueText}
              />

              <Text
                title={data?.name}
                numberOfLines={1}
                fontFamily="semi-bold"
                fontSize={18}
                color={Colors.light.darkBlue}
              />

              <Text
                title={data?.profession}
                numberOfLines={1}
                fontFamily="regular"
                fontSize={16}
                color={Colors.light.blue}
              />

              {dataUID.data.uid !== auth?.currentUser?.uid && (
                <ButtonFollow
                  activeOpacity={0.7}
                  onPress={() => {
                    setFollow((prevState) => !prevState);
                  }}
                >
                  <Text
                    title={isFollow ? "Following" : "Follow"}
                    numberOfLines={1}
                    fontFamily="semi-bold"
                    fontSize={16}
                    color={Colors.light.background}
                  />
                </ButtonFollow>
              )}
            </ContentText>
          </Row>

          <ContainerAbout>
            <Text
              title="About me"
              fontFamily="semi-bold"
              fontSize={16}
              color={Colors.light.darkBlue}
            />

            <Text
              title={data?.aboutMe}
              fontFamily="regular"
              fontSize={14}
              lineHeight={20}
              numberOfLines={4}
              color={Colors.light.blueText}
            />
          </ContainerAbout>
        </ContainerBody>
      </Content>

      <ContainerInfo>
        <ContentInfo>
          <ColumnInfo>
            <Text
              title={posts.toString()}
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Post"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>

          <ColumnInfo>
            <Text
              title="0"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Following"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>

          <ColumnInfo>
            <Text
              title="0"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Followers"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>
        </ContentInfo>
      </ContainerInfo>
    </>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.01,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
