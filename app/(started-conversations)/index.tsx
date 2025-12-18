import React, { useCallback, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  Pressable,
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
    const result = queryMyMessages?.data[0]?.messages?.participants.includes(
      auth.currentUser?.uid
    );

    return result;
  };

  const getThumbnail = (item) => {
    const result = queryMyMessages?.data[0]?.messages?.participants.indexOf(
      auth.currentUser?.uid
    );

    return result === 0
      ? item.messages.thumbnailUser
      : item.messages.thumbnailTarget;
  };

  const getChatId = (user1: string, user2: string) =>
    [user1, user2].sort().join("_");

  const hideChatForUser = async (item) => {
    try {
      const chatId = getChatId(auth.currentUser?.uid, conditionTarget(item));

      const chatRef = doc(db, "chats", chatId);

      await setDoc(
        chatRef,
        {
          messages: {
            ...item.messages,
            removedFor: arrayUnion(auth.currentUser?.uid),
          },
        },
        { merge: true }
      );

      queryClient.invalidateQueries({ queryKey: ["chatsMyMessages"] });

      console.log("Conversa oculta com sucesso");
    } catch (error) {
      console.error("Erro ao ocultar conversa:", error);
    }
  };

  const handleDelete = async (item) => {
    hideChatForUser(item);
  };

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: () => {},
  });

  const handleReadAt = async (item) => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      const targetId = conditionTarget(item);

      const chatId = getChatId(userId, targetId);

      const chatRef = doc(db, "chats", chatId);

      await setDoc(
        chatRef,
        {
          messages: {
            ...item.messages,
            readAt: new Date(),
          },
        },
        { merge: true }
      );

      queryClient.invalidateQueries({ queryKey: ["chatsMyMessages"] });

      router.push({
        pathname: "/(chat)",
        params: { uid: targetId },
      });
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
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

            {!item.messages.readAt && conditionUserTarget() && <Pointer />}
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
        <Pressable onPress={() => router.back()}>
          <ButtonContent glassEffectStyle="clear" isInteractive>
            <FontAwesome6
              name="chevron-left"
              size={24}
              color={Colors.light.darkBlue}
            />
          </ButtonContent>
        </Pressable>
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
            const row = rowMap[rowKey];

            setTimeout(() => {
              row?.closeRow();
            }, 1000);

            Alert.alert(
              "Are you sure you want to delete this conversation?",
              "the conversation will be hidden for you",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: () => row?.closeRow(),
                },
                {
                  text: "OK",
                  onPress: () => mutation.mutate(row.props.item),
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
