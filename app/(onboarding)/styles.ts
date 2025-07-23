import styled from "styled-components/native";
import { Image } from "expo-image";
import { Colors } from "@/constants/Colors";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9faff;
  padding-top: 72px;
`;

export const Thumbnail = styled(Image)`
  width: 400px;
  height: 462px;
`;

export const Body = styled.View`
  width: 100%;
  padding-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  /* background-color: red; */
  background-color: ${Colors.light.background};
  gap: 16px;
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`;

export const Footer = styled.View`
  background-color: ${Colors.light.background};
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 120px;
  margin-top: 32px;
`;

export const Button = styled.TouchableOpacity`
  width: 88px;
  height: 60px;
  background-color: ${Colors.light.blue};
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;
