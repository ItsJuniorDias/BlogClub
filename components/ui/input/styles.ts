import { Colors } from "@/constants/Colors";
import { TextInputProps } from "react-native";
import styled from "styled-components/native";

interface InputCustomProps extends TextInputProps {
  isError: string | undefined;
}

export const Container = styled.View`
  width: 100%;
  margin-top: 16px;
  gap: 12px;
`;

export const InputCustom = styled.TextInput<InputCustomProps>`
  width: 100%;
  height: 40px;
  font-family: "MontserratSemiBold";
  font-size: 14px;
  border-bottom-width: 1px;
  border-color: ${({ isError }) => (isError ? "red" : "#d9dfeb")};
  color: ${Colors.light.darkBlue}; 
`;
