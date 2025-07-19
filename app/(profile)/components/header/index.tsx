import { deleteUser, getAuth, signOut } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";

import * as ImagePicker from "expo-image-picker";

import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "../../../../components/ui";

import { Colors } from "@/constants/Colors";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, auth } from "@/firebaseConfig";

import { queryUserByUID } from "@/utils/queryUserByUID";
import { useUIDStore } from "@/store/useIDStore";

import {
  BorderContainer,
  ButtonDelete,
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
import { useRouter } from "expo-router";

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

  const router = useRouter();

  const auth = getAuth();

  const dataUID = useUIDStore();

  const queryUserUID = !!dataUID.data.uid
    ? dataUID.data.uid
    : auth.currentUser?.uid;

  const { data } = useQuery({
    queryKey: ["userByUID"],
    queryFn: () => queryUserByUID(queryUserUID),
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

  const getFollowers = async (userId: string) => {
    const followersRef = collection(db, "users", userId, "followers");

    const snapshot = await getDocs(followersRef);

    return snapshot.docs.map((doc) => doc.id);
  };

  const queryGetFollowers = useQuery({
    queryKey: ["getFollowers"],
    queryFn: () => getFollowers(queryUserUID),
  });

  const getFollowing = async (userId: string) => {
    const followingRef = collection(db, "users", userId, "following");

    const snapshot = await getDocs(followingRef);

    return snapshot.docs.map((doc) => doc.id);
  };

  const queryGetFollowing = useQuery({
    queryKey: ["getFollowing"],
    queryFn: () => getFollowing(queryUserUID),
  });

  const followUser = async (currentUserId: string, targetUserId: string) => {
    try {
      await setDoc(doc(db, "users", currentUserId, "following", targetUserId), {
        followedAt: serverTimestamp(),
      });

      await setDoc(doc(db, "users", targetUserId, "followers", currentUserId), {
        followedAt: serverTimestamp(),
      });

      queryClient.invalidateQueries({ queryKey: ["getFollowing"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowers"] });

      console.log("User followed successfully");
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    try {
      await deleteDoc(
        doc(db, "users", currentUserId, "following", targetUserId)
      );
      await deleteDoc(
        doc(db, "users", targetUserId, "followers", currentUserId)
      );

      queryClient.invalidateQueries({ queryKey: ["getFollowing"] });
      queryClient.invalidateQueries({ queryKey: ["getFollowers"] });

      console.log("User unfollowed successfully");
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleDelete = async (currentUser) => {
    try {
      await deleteUser(currentUser);

      const userDocRef = doc(db, "users", currentUser.uid);

      deleteDoc(userDocRef)
        .then(() => {
          console.log("Document user deleted with success.");
        })
        .catch((error) => {
          console.error("Error deleted by document:", error);
        });

      Alert.alert("User delete with success", "Your account was deleted", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            handleSignOut();
          },
        },
      ]);
    } catch (error) {}
  };

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
            <BorderContainer
              onPress={() => {
                if (dataUID.data.uid === auth?.currentUser?.uid) {
                  mutation.mutate({});
                }
              }}
            >
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

              {!!dataUID.data.uid &&
              dataUID.data.uid !== auth.currentUser?.uid ? (
                <ButtonFollow
                  activeOpacity={0.7}
                  onPress={() => {
                    if (queryGetFollowers.data?.length > 0) {
                      unfollowUser(auth.currentUser?.uid, dataUID?.data?.uid);
                    } else {
                      followUser(auth.currentUser?.uid, dataUID?.data?.uid);
                    }

                    setFollow((prevState) => !prevState);
                  }}
                >
                  <Text
                    title={
                      queryGetFollowers.data?.length > 0
                        ? "Following"
                        : "Follow"
                    }
                    numberOfLines={1}
                    fontFamily="semi-bold"
                    fontSize={16}
                    color={Colors.light.background}
                  />
                </ButtonFollow>
              ) : (
                <ButtonDelete
                  activeOpacity={0.7}
                  onPress={() => handleDelete(auth.currentUser)}
                >
                  <Text
                    title={"Delete account"}
                    numberOfLines={1}
                    fontFamily="semi-bold"
                    fontSize={16}
                    color={Colors.light.red}
                  />
                </ButtonDelete>
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
              title={queryGetFollowing.data?.length}
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
              title={queryGetFollowers?.data?.length ?? ""}
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
