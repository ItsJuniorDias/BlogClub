import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  height: 134px;
  /* background-color: red; */
  padding-top: 64px;
  padding-left: 40px;
  padding-right: 40px;
  flex-direction: row;
  justify-content: space-between;
`;

export const Content = styled.View`
  gap: 8px;
`;

export const Notification = styled(Image)`
  width: 32px;
  height: 32px;
`;
