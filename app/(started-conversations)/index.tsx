import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";

import { useQuery } from "@tanstack/react-query";
import { ButtonContent, Container, Skeleton } from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function UserChatsScreen() {
  const auth = getAuth();

  const router = useRouter();

  const fetchLastMessage = async () => {
    const docRef = collection(db, "chats");

    const querySnapshot = await getDocs(docRef);

    const formatData = querySnapshot.docs.map((item) => {
      return {
        ...item.data(),
        id: item.id,
      };
    });

    const userTarget = formatData[0].id.split("_");

    const formatKEY = `${userTarget[0]}_${auth?.currentUser?.uid}`;

    const docMessagesRef = collection(db, "chats", `${formatKEY}`, "messages");

    const queryMessageSnapshot = await getDocs(docMessagesRef);

    const formatMessageData = queryMessageSnapshot.docs.map((item) => {
      return {
        ...item.data(),
        user: {
          name: item.data().user.name,
          _id: item.data().user._id,
        },
      };
    });

    return [formatMessageData[formatMessageData.length - 1]];
  };

  const query = useQuery({ queryKey: ["chats"], queryFn: fetchLastMessage });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        router.push({
          pathname: "/(chat)",
          params: {
            uid: chats[0].user?._id,
          },
        })
      }
    >
      <Text style={styles.name}>{item.user.name}</Text>
      <Text style={styles.message}>{item.text || "Sem mensagem"}</Text>
      <Text style={styles.time}>
        {item.createdAt
          ? item.createdAt.toDate().toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    return (
      <>
        <ButtonContent onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={32} color={Colors.light.darkBlue} />
        </ButtonContent>
      </>
    );
  };

  return (
    <Container>
      {query.isLoading && (
        <>
          {renderHeader()}
          <Skeleton />
        </>
      )}

      {!query.isLoading && (
        <FlatList
          data={query.data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text style={styles.empty}>Você não possui conversas.</Text>
          }
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
    marginVertical: 6,
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
