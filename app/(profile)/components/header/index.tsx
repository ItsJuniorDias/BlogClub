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
import { useUserStore } from "@/store/useUserStore";

interface HeaderProfileProps {
  title: string;
  icon: string;
  posts: number;
}

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

  const dataUserStore = useUserStore();

  const queryUserUID = !!dataUID.data.uid
    ? dataUID.data.uid
    : auth.currentUser?.uid;

  const { data } = useQuery({
    queryKey: ["userByUID"],
    queryFn: () => queryUserByUID(queryUserUID),
  });

  const handleSignOut = async () => {
    Alert.alert("really want to leave", "you will be logged out of the app", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          if (queryUserUID) {
            signOut(auth)
              .then(() => {})
              .catch((error) => {
                console.error("Sign out error:", error);
              });
          } else {
            router.replace("/(sign-in)");
          }
        },
      },
    ]);
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

      return uploadImageToCloudinary({
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
      type: "image/jpeg",
      name: fileName,
    });

    data.append("upload_preset", "expo-upload");
    data.append("cloud_name", "dqvujibkn");

    let res;

    try {
      res = await fetch(
        "https://api.cloudinary.com/v1_1/dqvujibkn/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
    } catch (e) {
      console.log(e);
    }

    const result = await res?.json();

    const userRef = doc(db, "users", auth.currentUser?.uid);

    await updateDoc(userRef, {
      thumbnail: result.secure_url,
    });

    queryClient.invalidateQueries({ queryKey: ["userByUID"] });

    return result.url;
  };

  const mutation = useMutation({
    mutationFn: pickImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStoryByUID"] });
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
      Alert.alert(
        "Are you sure you want to delete your user?",
        "your account will be permanently deleted",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await deleteUser(currentUser);

              const userDocRef = doc(db, "users", currentUser.uid);

              deleteDoc(userDocRef)
                .then(() => {
                  console.log("Document user deleted with success.");
                })
                .catch((error) => {
                  console.error("Error deleted by document:", error);
                });

              handleSignOut();
            },
          },
        ]
      );
    } catch (error) {}
  };

  const mutationDelete = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {},
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
            <BorderContainer
              onPress={() => {
                if (queryUserUID === auth?.currentUser?.uid) {
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
                  {!!data?.thumbnail || !!dataUserStore?.data?.thumbnail ? (
                    <Thumbnail
                      source={data?.thumbnail ?? dataUserStore?.data?.thumbnail}
                    />
                  ) : (
                    <FontAwesome5 name="user" size={40} color="#333" />
                  )}
                </>
              )}
            </BorderContainer>

            <ContentText>
              <Text
                title={data?.email ?? dataUserStore?.data?.email}
                numberOfLines={1}
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.blueText}
              />

              <Text
                title={data?.name ?? dataUserStore?.data?.name}
                numberOfLines={1}
                fontFamily="semi-bold"
                fontSize={18}
                color={Colors.light.darkBlue}
              />

              <Text
                title={data?.profession ?? "Profession"}
                numberOfLines={1}
                fontFamily="regular"
                fontSize={16}
                color={Colors.light.blue}
              />

              {queryUserUID !== auth.currentUser?.uid ? (
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
                  onPress={() => mutationDelete.mutate(auth.currentUser)}
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
              title={data?.aboutMe ?? "Write something about yourself"}
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
              title={queryGetFollowing.data?.length ?? "0"}
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
              title={queryGetFollowers?.data?.length ?? "0"}
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
