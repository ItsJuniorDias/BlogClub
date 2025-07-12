import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import HeaderNewArticle from "../(new-article)/components/header/header";
import InputBody from "../(new-article)/components/input-body/input-body";
import { useQuery } from "@tanstack/react-query";
import BottomSheet from "@/components/ui/bottomsheet/bottomsheet";
import { Button } from "@/components/ui";

const UNSPLASH_ACCESS_KEY = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg";

export default function NewArticle() {
  const [queryUnplash, setQueryUnplash] = useState("photos");

  const [isOpen, setIsOpen] = useState(false);

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
        <HeaderNewArticle pickImage={pickImage} />

        <InputBody image={image} />

        <Button
          isLoading={false}
          title="Abrir Bottom Sheet"
          onPress={() => setIsOpen(true)}
        />
      </ScrollView>
      <Toast />

      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
