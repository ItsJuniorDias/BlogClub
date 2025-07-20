import { View, Dimensions } from "react-native";

import * as React from "react";

import carousel_1 from "../../../../assets/images/carousel_1.png";
import carousel_2 from "../../../../assets/images/carousel_2.png";

import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { Text } from "../../../../components/ui";

import { Container, Content, LinearGradientCustom, Thumbnail } from "./styles";
import { Colors } from "@/constants/Colors";

interface CarouselComponentProps {
  onSnapToItem: (item: number) => void;
}

export default function CarouselComponent({
  onSnapToItem,
}: CarouselComponentProps) {
  const DATA = [
    {
      id: "1",
      title: "Technology",
      image: carousel_1,
    },
    {
      id: "2",
      title: "Adventure",
      image: carousel_2,
    },
    {
      id: "2",
      title: "Philosophy",
      image:
        "https://images.unsplash.com/photo-1581855339095-0c282d58527b?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const width = Dimensions.get("window").width;

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const Item = ({ title, image }) => (
    <View>
      <Content activeOpacity={0.7} onPress={() => onSnapToItem(progress.value)}>
        <Thumbnail source={image} />
      </Content>

      <LinearGradientCustom colors={["transparent", "rgba(0,0,0,0.8)"]}>
        <Text
          title={title}
          fontFamily="bold"
          fontSize={24}
          color={Colors.light.background}
        />
      </LinearGradientCustom>
    </View>
  );

  return (
    <Container>
      <Carousel
        ref={ref}
        data={DATA}
        loop={false}
        width={width}
        height={400}
        onSnapToItem={(item) => {
          onSnapToItem(item);
        }}
        mode="parallax"
        onProgressChange={progress}
        renderItem={({ item }) => {
          return <Item title={item.title} image={item.image} />;
        }}
      />
    </Container>
  );
}
