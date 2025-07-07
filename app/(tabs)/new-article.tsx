import { ScrollView, StyleSheet } from "react-native";

import HeaderNewArticle from "../(new-article)/components/header/header";
import Input from "../(new-article)/components/input/input";

export default function NewArticle() {
  return (
    <ScrollView style={styles.container}>
      <HeaderNewArticle />

      <Input />
    </ScrollView>
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
