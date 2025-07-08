import { View, StyleSheet, ScrollView } from "react-native";

import HeaderProfile from "../(profile)/components/header";
import BodyProfile from "../(profile)/components/body";

export default function Profile() {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 96,
      }}
      style={styles.container}
    >
      <HeaderProfile title="Profile" icon="more-horizontal" />

      <BodyProfile />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});
