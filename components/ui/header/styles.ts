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

export const ContentPointer = styled.View`
  align-items: flex-end;
`;

export const Pointer = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 50px;
  background-color: red;
  position: absolute;
`;
