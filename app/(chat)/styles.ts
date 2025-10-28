import { Colors } from "@/constants/Colors";
import { GlassView } from "expo-glass-effect";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const ButtonContent = styled(GlassView)`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-top: 64px;
  border-radius: 50px;
`;
