import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.light.background};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 72px;
  margin-bottom: 24px;
`;

export const ContentInfo = styled.View`
  width: 100%;

  flex-direction: row;
  justify-content: space-between;
  margin-top: 32px;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 32px;
`;

export const Thumbnail = styled(Image)`
  width: 38px;
  height: 38px;
  margin-right: -16px;
`;

export const ContentText = styled.View`
  gap: 6px;
`;
