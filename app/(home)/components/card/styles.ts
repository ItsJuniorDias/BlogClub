import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  margin-top: 24px;
`;

export const Content = styled.TouchableOpacity`
  width: 72px;
  height: 92px;
  margin-left: 40px;
  margin-right: -24px;
  align-items: center;
  justify-content: space-between;
`;

export const LinearGradientCustom = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  border-color: ${Colors.light.blueLight};

  background-color: white;
  border-width: 2;
`;

export const Thumbnail = styled(Image)`
  width: 54px;
  height: 54px;
  border-radius: 16px;
`;

export const CategoryIcon = styled(Image)`
  width: 20px;
  height: 20px;
  position: absolute;
  margin-top: 44px;
  margin-left: 44px;
`;
