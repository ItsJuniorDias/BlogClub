import React from "react";
import { View } from "react-native";

import thumbnail from "../../../../assets/images/thumbnail.png";

import { Container, Thumbnail } from "./styles";

export default function Card() {
  return (
    <Container>
      <Thumbnail source={thumbnail} />
    </Container>
  );
}
