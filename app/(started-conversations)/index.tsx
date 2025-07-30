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
import { db } from "../../firebaseConfig"; // seu arquivo de config Firebase
import { queryAllUsers } from "@/utils/queryAllUsers";
import { useQuery } from "@tanstack/react-query";
import { ButtonContent } from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function UserChatsScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const currentUser = getAuth().currentUser;

  const router = useRouter();

  // console.log(currentUser?.uid, "UID AUTHS");

  const query = useQuery({ queryKey: ["todos"], queryFn: queryAllUsers });

  useEffect(() => {
    if (!currentUser) return;

    const fetch = async () => {
      const docRef = collection(db, "chats");

      const querySnapshot = await getDocs(docRef);

      const formatData = querySnapshot.docs.map((item) => {
        return {
          ...item.data(),
          id: item.id,
        };
      });

      const userTarget = formatData[0].id.split("_");

      const formatKEY = `${userTarget[0]}_${currentUser.uid}`;

      const docMessagesRef = collection(
        db,
        "chats",
        `${formatKEY}`,
        "messages"
      );

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

      setChats([formatMessageData[1]]);
    };

    fetch();
  }, [currentUser]);

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
      <Text style={styles.message}>{item.lastMessage || "Sem mensagem"}</Text>
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

  console.log(chats, "CHATS");

  return (
    <View style={styles.container}>
      <ButtonContent onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={32} color={Colors.light.darkBlue} />
      </ButtonContent>

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
