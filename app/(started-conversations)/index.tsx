import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import { collection, query, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Text } from "../../components/ui";

import {
  ButtonContent,
  Container,
  ContentText,
  FooterText,
  Row,
  Skeleton,
  Thumbnail,
} from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function UserChatsScreen() {
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

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

  const formatMyMessages = useCallback(() => {
    const filterMyMessageOne = queryAllMessages?.data?.filter(
      (item) => item?.messages?.participants[0] === auth?.currentUser?.uid
    );

    if (!filterMyMessageOne?.length) {
      const filterMyMessageTwo = queryAllMessages?.data?.filter(
        (item) => item?.messages?.participants[1] === auth?.currentUser?.uid
      );

      setTimeout(() => {
        setLoading(false);
      }, 3000);

      return filterMyMessageTwo;
    }

    setTimeout(() => {
      setLoading(false);
    }, 3000);

    return filterMyMessageOne;
  }, [queryAllMessages?.data, auth?.currentUser?.uid]);

  const queryMyMessages = useQuery({
    queryKey: ["chatsMyMessages"],
    queryFn: formatMyMessages,
  });

  const conditionTarget = () => {
    return Platform.OS === "android"
      ? queryMyMessages?.data[0].messages?.participants[1]
      : queryMyMessages?.data[0].messages?.participants[0];
  };

  const getThumbnail = () => {
    return queryMyMessages?.data[0]?.messages?.participants.indexOf(
      auth.currentUser?.uid
    ) === 1
      ? queryMyMessages?.data[0]?.messages?.thumbnailTarget
      : queryMyMessages?.data[0]?.messages?.thumbnailUser;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        router.push({
          pathname: "/(chat)",
          params: {
            uid: conditionTarget(),
          },
        });
      }}
    >
      <Row>
        <Thumbnail
          source={{
            uri: `${getThumbnail()}`,
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
            title={item.messages.text || "Sem mensagem"}
            fontFamily="regular"
            fontSize={14}
            color={Colors.light.darkBlue}
          />
        </ContentText>
      </Row>

      <FooterText>
        <Text
          title={
            !!item?.messages?.createdAt
              ? item?.messages?.createdAt.toDate().toLocaleTimeString("pt-BR", {
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
      {loading && (
        <>
          {renderHeader()}
          {queryMyMessages?.data?.map(() => (
            <Skeleton />
          ))}
        </>
      )}

      {!loading && (
        <FlatList
          data={queryMyMessages.data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text
              title="You have no conversations."
              fontFamily="semi-bold"
              fontSize={18}
              color={Colors.light.darkBlue}
              style={{ textAlign: "center" }}
            />
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
