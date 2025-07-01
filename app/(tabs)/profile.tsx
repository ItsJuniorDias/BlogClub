import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function Profile() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>👤 Perfil</Text>
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
  text: { fontSize: 24 },
});
