import { ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import HeaderNewArticle from "../(new-article)/components/header/header";
import InputBody from "../(new-article)/components/input-body/input-body";

export default function NewArticle() {
  const [image, setImage] = useState<string | null>(null);

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
