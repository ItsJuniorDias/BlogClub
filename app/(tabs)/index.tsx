import { View, Text, StyleSheet, ScrollView } from "react-native";

import { Card, CarouselComponent } from "../(home)/components";
import { Header, LatestNews } from "@/components/ui";

import big_data from "../../assets/images/big_data.png";

export default function HomeScreen() {
  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 }}
        style={styles.container}
      >
        <Header title="Hi, Alexandre!" description="Explore today’s" />

        <Card />

        <CarouselComponent />

        <LatestNews
          profileTitle="Latest News"
          image={big_data}
          title="BIG DATA"
          description={`Why Big Data Needs\nThick Data?`}
          numberLike={2.1}
          hours={1}
          isLike
        />
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
