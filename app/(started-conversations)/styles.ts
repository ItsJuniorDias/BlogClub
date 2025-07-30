import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: rgb(255, 255, 255);
  padding-top: 64px;
  padding-left: 24px;
  padding-right: 24px;
`;

export const ButtonContent = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-color: ${Colors.light.darkBlue};
  border-width: 2px;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
`;

export const Skeleton = styled.View`
  width: 100%;
  height: 96px;
  background-color: #ebebeb;
  padding: 12px;
  border-radius: 8px;
  margin-top: 24px;
`;
