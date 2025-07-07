import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  background-color: ${Colors.light.blue};
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  margin-top: 16px;
`;
