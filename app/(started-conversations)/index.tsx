import React from "react";
import { Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { collection, query, getDocs } from "firebase/firestore";
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

  const fetchAllMessages = async () => {
    const docRef = collection(db, "chats");

    const docSnap = await getDocs(docRef);

    return docSnap.docs.map((item) => ({
      ...item.data(),
    }));
  };

  const queryAllMessages = useQuery({
    queryKey: ["chatsAll"],
    queryFn: fetchAllMessages,
  });

  const formatMyMessages = () => {
    const filterMyMessage = queryAllMessages?.data?.filter(
      (item) => item?.messages?.participants[0] === auth?.currentUser?.uid
    );

    return filterMyMessage;
  };

  const queryMyMessages = useQuery({
    queryKey: ["chatsMyMessages"],
    queryFn: formatMyMessages,
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        router.push({
          pathname: "/(chat)",
          params: {
            uid: item.messages.participants[0],
          },
        });
      }}
    >
      <Text style={styles.name}>{item.messages.name}</Text>
      <Text style={styles.message}>{item.messages.text || "Sem mensagem"}</Text>
      <Text style={styles.time}>
        {item.messages.createdAt
          ? item.messages.createdAt.toDate().toLocaleTimeString("pt-BR", {
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
          data={queryMyMessages.data}
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
