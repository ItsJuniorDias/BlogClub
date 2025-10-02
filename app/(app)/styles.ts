import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${Colors.light.background};
  align-items: center;
  justify-content: center;
`;

export const Logo = styled(Image)`
  width: 161px;
  height: 161px;
`;
