import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import HeaderNewArticle from "../(new-article)/components/header/header";
import Input from "../(new-article)/components/input/input";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NewArticle() {
  const queryClient = useQueryClient();

  const [image, setImage] = useState<string | null>(null);

  const [text, onChangeText] = useState("");
  const [textProduct, onChangeTextProduct] = useState("");
  const [textArticle, onChangeTextArticle] = useState("");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: text,
        description: textProduct,
        thumbnail: image,
        article: textArticle,
        hours: 4,
        numberLike: 5.4,
        isLike: false,
      });

      Toast.show({
        type: "success", // 'success', 'error', 'info'
        text1: "Post create success",
        position: "top",
        text1Style: {
          fontFamily: "MontserratSemiBold",
          color: Colors.light.darkBlue,
          fontSize: 14,
        },
      });

      console.log("Documento criado com ID: ", docRef.id);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNewArticle pickImage={pickImage} />

        <Input
          text={text}
          onChangeText={onChangeText}
          textProduct={textProduct}
          onChangeTextProduct={onChangeTextProduct}
          textArticle={textArticle}
          onChangeTextArticle={onChangeTextArticle}
          handleSubmit={() => mutate()}
          isPending={isPending}
        />
      </ScrollView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  padding: {
    paddingBottom: 96,
  },
});
