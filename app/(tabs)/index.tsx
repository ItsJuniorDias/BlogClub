import { View, Text, StyleSheet, ScrollView } from "react-native";

import { Card } from "../(home)/components";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  text: {
    fontFamily: "MontserratSemiBold",
    fontSize: 24,
  },
});
