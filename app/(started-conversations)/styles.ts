import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.View``;

export const ButtonContent = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-color: ${Colors.light.darkBlue};
  border-width: 2px;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
  border-radius: 50px;
`;
