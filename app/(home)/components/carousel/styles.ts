import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  /* background-color: blue; */
`;

export const Content = styled.TouchableOpacity`
  width: 100%;
`;

export const Thumbnail = styled(Image)`
  width: 100%;
  height: 400px;
  border-radius: 32px;
`;

export const LinearGradientCustom = styled(LinearGradient)`
  width: 100%;
  height: 96px;
  padding-left: 24px;
  margin-top: -96px;
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
`;
