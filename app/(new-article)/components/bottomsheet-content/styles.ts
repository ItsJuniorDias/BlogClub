import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding-left: 24px;
  padding-right: 24px;
`;

export const Thumbnail = styled(Image)`
  width: 150px;
  height: 240px;
  border-radius: 24px;
  margin-right: 16px;
  margin-top: 24px;
`;

export const Row = styled.View`
  width: 100%;

  align-items: flex-end;
`;
