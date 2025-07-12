import { Button, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRef, useState } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import HeaderNewArticle from "../(new-article)/components/header/header";
import InputBody from "../(new-article)/components/input-body/input-body";
import { useQuery } from "@tanstack/react-query";

import AntDesign from "@expo/vector-icons/AntDesign";
import BottomSheet from "@/components/ui/bottomsheet";
import BottomSheetContent from "../(new-article)/components/bottomsheet-content/bottomsheet-content";

const UNSPLASH_ACCESS_KEY = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg";

export default function NewArticle() {
  const [queryUnplash, setQueryUnplash] = useState("photos");

  const [isOpen, setIsOpen] = useState(true);

  const bottomSheetRef = useRef(null);

  const [image, setImage] = useState<string | null>(null);

  const searchPhotos = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?page=1&query=${queryUnplash}&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
    }
  };

  const query = useQuery({ queryKey: ["photos"], queryFn: searchPhotos });

  console.log(query.data, "DATA");

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

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNewArticle onPress={() => bottomSheetRef.current?.open()} />

        <InputBody image={image} />
      </ScrollView>

      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetContent onClose={() => bottomSheetRef.current?.close()} />
      </BottomSheet>
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
