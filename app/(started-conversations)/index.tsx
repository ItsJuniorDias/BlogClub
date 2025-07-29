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
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig"; // seu arquivo de config Firebase

export default function UserChatsScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const currentUser = getAuth().currentUser;

  // const handleDataUserChat = async () => {
  //   try {
  //     const chatRef = await collection(db, "chat");

  //     const querySnapshot = await getDocs(chatRef);

  //     console.log(querySnapshot.docs, "QUERY SNAP");
  //   } catch (error) {
  //     console.error("Error al obtener documentos: ", error);
  //   }
  // };

  useEffect(() => {
    if (!currentUser) return;

    const fetch = async () => {
      // const response = await handleDataUserChat();
      // setChats(response);
    };

    fetch();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("Chat", {
          chatId: item.id,
          otherUser: item.otherUser,
        })
      }
    >
      <Text style={styles.name}>{item.otherUser.name}</Text>
      <Text style={styles.message}>{item.lastMessage || "Sem mensagem"}</Text>
      <Text style={styles.time}>
        {item.lastMessageAt
          ? item.lastMessageAt.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>Você não possui conversas.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  chatItem: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  name: { fontWeight: "bold", fontSize: 17, marginBottom: 4 },
  message: { fontSize: 14, color: "#444" },
  time: { fontSize: 12, color: "#888", marginTop: 6, textAlign: "right" },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});
