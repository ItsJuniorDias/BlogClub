import { View, Text, StyleSheet, ScrollView } from "react-native";

import { Card, CarouselComponent, LatestNews } from "../(home)/components";
import { Header } from "@/components/ui";

export default function HomeScreen() {
  return (
    <>
      <ScrollView style={styles.container}>
        <Header title="Hi, Alexandre!" description="Explore today’s" />

        <Card />

        <CarouselComponent />

        <LatestNews />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
});
