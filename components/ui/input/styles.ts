import { TextInputProps } from "react-native";
import styled from "styled-components/native";

export const Container = styled.View`
  width: 100%;
  margin-top: 16px;
  gap: 12px;
`;

export const InputCustom = styled.TextInput<TextInputProps>`
  width: 100%;
  height: 32px;

  font-family: "MontserratSemiBold";
  font-size: 14px;
  border-bottom-width: 1px;
  border-color: #d9dfeb;
`;
