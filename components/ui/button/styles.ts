import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  background-color: ${Colors.light.blue};
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;
