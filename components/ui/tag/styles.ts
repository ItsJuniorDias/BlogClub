import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  height: 32px;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${Colors.light.blue};
  flex-direction: row;
  align-items: center;
  padding-left: 8px;
  padding-right: 8px;
  gap: 8px;
`;

export const Button = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  background-color: ${Colors.light.blue};
  opacity: 0.7;
  border-radius: 50px;
  align-items: center;
  justify-content: center;
`;
