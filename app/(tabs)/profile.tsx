import { View, StyleSheet, ScrollView } from "react-native";

import HeaderProfile from "../(profile)/components/header";

export default function Profile() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderProfile title="Profile" icon="more-horizontal" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9faff",
  },
});
