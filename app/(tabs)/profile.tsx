import { View, StyleSheet, ScrollView } from "react-native";

import HeaderProfile from "../(profile)/components/header";
import BodyProfile from "../(profile)/components/body";
import { useState } from "react";

export default function Profile() {
  const [value, setValue] = useState({
    post: 0,
  });

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 96,
      }}
      style={styles.container}
    >
      <HeaderProfile posts={value.post} title="Profile" icon="exit-to-app" />

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
