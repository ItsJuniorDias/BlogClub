import React, { useEffect, useState, useCallback } from "react";

import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
  View,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "../../components/ui";

import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../../firebaseConfig";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { ButtonContent } from "./styles";
import { useQuery } from "@tanstack/react-query";
import { queryUserByUID } from "@/utils/queryUserByUID";
import { FontAwesome6 } from "@expo/vector-icons";

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  const params = useLocalSearchParams();

  const auth = getAuth();

  const router = useRouter();

  const getChatId = (user1: string, user2: string) => {
    return [user1, user2].sort().join("_");
  };

  const queryUser = useQuery({
    queryKey: ["getUser"],
    queryFn: () => queryUserByUID(auth.currentUser?.uid),
  });

  const queryParamsUser = useQuery({
    queryKey: ["getParamsUser"],
    queryFn: () => queryUserByUID(params?.uid),
  });

  useEffect(() => {
    const q = query(
      collection(
        db,
        "chats",
        getChatId(auth.currentUser?.uid, params.uid),
        "messages"
      ),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesFirestore = querySnapshot.docs.map((doc) => {
        const firebaseData = doc.data();

        return {
          participants: [auth.currentUser?.uid, params.uid],
          _id: doc.id,
          text: firebaseData.text,
          createdAt: firebaseData.createdAt.toDate(),
          user: firebaseData.user,
          removedFor: [],
        };
      });

      setMessages(messagesFirestore);
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback(
    async (messages = []) => {
      const { _id, createdAt, text, user } = messages[0];

      await addDoc(
        collection(
          db,
          "chats",
          getChatId(auth.currentUser?.uid, params.uid),
          "messages"
        ),
        {
          _id,
          createdAt,
          text,
          user,
        }
      );

      setTimeout(async () => {
        await setDoc(
          doc(db, "chats", getChatId(auth.currentUser?.uid, params.uid)),
          {
            messages: {
              participants: [params.uid, auth.currentUser?.uid],
              name: queryParamsUser?.data?.name,
              text: text,
              createdAt,
              thumbnailTarget: queryParamsUser?.data?.thumbnail ?? "",
              thumbnailUser: queryUser?.data?.thumbnail ?? "",
              readAt: null,
              removedFor: [],
            },
          }
        );
      }, 2000);
    },
    [
      auth.currentUser?.uid,
      params.uid,
      queryParamsUser?.data?.name,
      queryParamsUser?.data?.thumbnail,
      queryUser?.data?.thumbnail,
    ]
  );

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.light.blue,
            padding: 8,
            borderRadius: 12,
            fontFamily: "MontserratRegular",
          },
          left: {
            backgroundColor: "#e5e5ea",
            padding: 8,
            borderRadius: 12,
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
            fontSize: 16,
            fontFamily: "MontserratRegular",
          },
          left: {
            color: "#000",
            fontSize: 16,
            fontFamily: "MontserratRegular",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        textInputStyle={styles.textInput}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Text
            title={"Enviar"}
            fontSize={14}
            fontFamily="regular"
            color={Colors.light.background}
          />
        </View>
      </Send>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#f2f2f2",
          paddingBottom: 24,
          borderRadius: 32,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <ButtonContent isInteractive glassEffectStyle="clear">
            <FontAwesome6
              name="chevron-left"
              size={24}
              color={Colors.light.darkBlue}
            />
          </ButtonContent>
        </Pressable>

        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: auth.currentUser?.uid,
            name: queryUser?.data?.name ?? "",
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          placeholder="Digite sua mensagem..."
          alwaysShowSend
          scrollToBottom
          showAvatarForEveryMessage={false}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: "#fff",
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 32,
  },
  textInput: {
    color: "#333",
    fontSize: 16,
    paddingHorizontal: 10,
    fontFamily: "MontserratRegular",
  },
  sendButton: {
    width: 64,
    height: 32,
    backgroundColor: Colors.light.blue,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendText: {
    color: "white",
    fontSize: 16,
  },
});
