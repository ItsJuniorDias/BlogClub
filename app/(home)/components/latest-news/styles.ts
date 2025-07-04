import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  /* height: 192px; */
  /* background-color: blue; */
  padding-left: 40px;
  padding-right: 40px;
`;

export const ContentText = styled.View`
  /* background-color: green; */
  flex-direction: row;
  /* padding-top: 40px; */
  padding-bottom: 24px;
  justify-content: space-between;
`;

export const Body = styled.TouchableOpacity`
  flex-direction: row;
  gap: 16px;
  background-color: ${Colors.light.background};
  border-radius: 16px;
  margin-bottom: 120px;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const Thumbnail = styled(Image)`
  width: 92px;
  height: 141px;
`;

export const ContentBody = styled.View`
  /* background-color: red; */
  padding-top: 24px;
  gap: 24px;
`;

export const ContentTextBody = styled.View`
  gap: 8px;
`;
