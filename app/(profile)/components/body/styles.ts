import { Platform } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  background-color: #fafbff;
  margin-top: 32px;
  padding-top: 32px;
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`;

export const ContentEmpty = styled.View`
  width: 100%;
  height: 240px;
  padding-left: 32px;
  padding-right: 32px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${Platform.OS === 'android' ? 64 : 0} ;
  gap: 8px;
`;
