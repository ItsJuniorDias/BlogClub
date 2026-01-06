import { View, Dimensions } from "react-native";

import * as React from "react";

import carousel_1 from "../../../../assets/images/carousel_1.png";
import carousel_2 from "../../../../assets/images/carousel_2.png";

import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

import { Text } from "../../../../components/ui";

import { Container, Content, LinearGradientCustom, Thumbnail } from "./styles";
import { Colors } from "@/constants/Colors";
import { useWindowDimensions } from "react-native";

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

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = SCREEN_WIDTH * 0.85;

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

  function isTablet(): boolean {
    const { width, height } = useWindowDimensions();
    const smallestDimension = Math.min(width, height);

    return smallestDimension >= 768;
  }

  return (
    <Container>
      <Carousel
        ref={ref}
        data={DATA}
        loop={false}
        width={isTablet() ? ITEM_WIDTH : width}
        height={400}
        style={{
          width: isTablet() ? SCREEN_WIDTH : width,
          justifyContent: "center",
        }}
        onSnapToItem={(item) => {
          onSnapToItem(item);
        }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: isTablet() ? 0.9 : 0.8,
          parallaxScrollingOffset: isTablet() ? 60 : 90,
        }}
        onProgressChange={progress}
        renderItem={({ item }) => {
          return <Item title={item.title} image={item.image} />;
        }}
      />
    </Container>
  );
}
