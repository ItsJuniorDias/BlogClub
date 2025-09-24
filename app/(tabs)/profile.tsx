import { View, StyleSheet, ScrollView } from "react-native";

import HeaderProfile from "../(profile)/components/header";
import BodyProfile from "../(profile)/components/body";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";

export default function Profile() {
  const [value, setValue] = useState({
    post: 0,
  });

  const { uid } = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={{}} style={styles.container}>
      <StatusBar style="dark" />

      <HeaderProfile
        uid={uid}
        posts={value.post}
        title="Profile"
        icon="exit-to-app"
      />

      <BodyProfile
        onForeignKey={(item) =>
          setValue((prevState) => ({
            ...prevState,
            post: item.length,
          }))
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});
