import React, { useCallback, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";

import { SwipeListView } from "react-native-swipe-list-view";

import Ionicons from "@expo/vector-icons/Ionicons";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Text } from "../../components/ui";

import {
  ButtonContent,
  Container,
  Content,
  ContentNotification,
  ContentText,
  FooterText,
  Pointer,
  Row,
  Skeleton,
  Thumbnail,
} from "./styles";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { formatMyMessages } from "@/utils/formatMyMessages";

export default function UserChatsScreen() {
  const auth = getAuth();

  const router = useRouter();

  const queryClient = useQueryClient();

  const queryMyMessages = useQuery({
    queryKey: ["chatsMyMessages"],
    queryFn: formatMyMessages,
  });

  const conditionTarget = (item) => {
    const result = item.messages.participants[0] === auth.currentUser?.uid;

    return result
      ? item.messages.participants[1]
      : item.messages.participants[0];
  };

  const conditionUserTarget = () => {
    const result = queryMyMessages?.data[0]?.messages?.participants.indexOf(
      auth.currentUser?.uid
    );

    return result === 0 ? 0 : 1;
  };

  const getThumbnail = (item) => {
    const result = queryMyMessages?.data[0]?.messages?.participants.indexOf(
      auth.currentUser?.uid
    );

    return result === 0
      ? item.messages.thumbnailUser
      : item.messages.thumbnailTarget;
  };

  async function getAllMessages(chatId: string) {
    const messagesRef = collection(db, "chats", chatId, "messages");

    const q = query(messagesRef);
    const querySnapshot = await getDocs(q);

    const messages = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return messages;
  }

  const hideChatForUser = async (item) => {
    try {
      const refDoc = doc(
        db,
        "chats",
        `${conditionTarget(item)}_${auth.currentUser?.uid}`
      );

      const refDocTarget = doc(
        db,
        "chats",
        `${auth.currentUser?.uid}_${conditionTarget(item)}`
      );

      const getDocs = getDoc(refDoc);

      if ((await getDocs).exists()) {
        await setDoc(
          refDoc,
          {
            messages: {
              ...item.messages,
              removedFor: arrayUnion(auth.currentUser?.uid),
            },
          },
          {
            merge: true,
          }
        );
      } else {
        await setDoc(
          refDocTarget,
          {
            messages: {
              ...item.messages,
              removedFor: arrayUnion(auth.currentUser?.uid),
            },
          },
          {
            merge: true,
          }
        );
      }

      queryClient.invalidateQueries({ queryKey: ["chatsMyMessages"] });

      console.log("Conversa oculta para o usuário");
    } catch (error) {
      console.error("Erro ao ocultar a conversa:", error);
    }
  };

  const handleDelete = async (item) => {
    hideChatForUser(item);
  };

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {},
  });

  const handleReadAt = async (item, index) => {
    const referencia = doc(
      db,
      "chats",
      `${item.messages.participants[0]}_${item.messages.participants[1]}`
    );

    const snapshot = await getDoc(referencia);

    if (conditionUserTarget() === 0 && snapshot.exists()) {
      await setDoc(
        doc(
          db,
          "chats",
          `${item.messages.participants[0]}_${item.messages.participants[1]}`
        ),
        {
          messages: {
            ...item.messages,
            readAt: new Date(),
          },
        },
        {
          merge: true,
        }
      );

      queryClient.invalidateQueries({ queryKey: ["chatsMyMessages"] });
    }

    router.push({
      pathname: "/(chat)",
      params: {
        uid: conditionTarget(item, index),
      },
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleReadAt(item, index)}
      >
        <Row>
          <Content>
            <Thumbnail
              source={{
                uri: `${getThumbnail(item)}`,
              }}
            />

            <ContentText>
              <Text
                title={item.messages.name}
                fontFamily="bold"
                fontSize={16}
                color={Colors.light.darkBlue}
              />

              <Text
                numberOfLines={1}
                title={item.messages.text || "Sem mensagem"}
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.darkBlue}
              />
            </ContentText>
          </Content>

          <ContentNotification>
            <Ionicons name="notifications-outline" size={32} color="black" />

            {!item.messages.readAt && conditionUserTarget() === 0 && (
              <Pointer />
            )}
          </ContentNotification>
        </Row>

        <FooterText>
          <Text
            title={
              !!item?.messages?.createdAt
                ? item?.messages?.createdAt
                    .toDate()
                    .toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                : ""
            }
            fontFamily="regular"
            fontSize={12}
            color={Colors.light.darkBlue}
          />
        </FooterText>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <ButtonContent onPress={() => router.back()}>
          <FontAwesome6
            name="chevron-left"
            size={24}
            color={Colors.light.darkBlue}
          />
        </ButtonContent>
      </>
    );
  };

  return (
    <Container>
      {queryMyMessages.isLoading && (
        <>
          {renderHeader()}
          {queryMyMessages?.data?.map(() => (
            <Skeleton />
          ))}
        </>
      )}

      {!queryMyMessages.isLoading && (
        <SwipeListView
          data={queryMyMessages.data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          renderHiddenItem={({ item }) => <View></View>}
          ListEmptyComponent={
            <Text
              title="You have no conversations."
              fontFamily="semi-bold"
              fontSize={18}
              color={Colors.light.darkBlue}
              style={{ textAlign: "center" }}
            />
          }
          rightOpenValue={-75}
          disableRightSwipe
          onRowOpen={(rowKey, rowMap) => {
            setTimeout(() => {
              if (rowMap[rowKey]) {
                rowMap[rowKey].closeRow();
              }
            }, 1000);

            Alert.alert(
              "Are you sure you want to delete this conversation?",
              "the conversation will be deleted for both users",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () => mutation.mutate(rowMap.undefined.props.item),
                },
              ]
            );
          }}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
  },
  chatItem: {
    width: "100%",
    height: 96,
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  name: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: "#444",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
    textAlign: "right",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
