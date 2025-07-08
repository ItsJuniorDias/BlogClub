import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const Container = styled.View`
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 32px;
  gap: 16px;
`;

export const InputCustom = styled.TextInput`
  width: 100%;
  height: 38px;
  border-bottom-width: 2px;
  border-color: ${Colors.light.lightGray};
  font-family: "MontserratSemiBold";
  font-size: 22px;
`;

export const InputProduct = styled.TextInput`
  width: 100%;
  height: 38px;
  border-bottom-width: 2px;
  border-color: ${Colors.light.lightGray};
  font-family: "MontserratRegular";
  font-size: 18px;
`;

export const ContentTag = styled.View`
  margin-top: 16px;
  gap: 8px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const InputArticle = styled.TextInput`
  width: 100%;
  height: 244px;
  border-bottom-width: 2px;
  border-color: ${Colors.light.lightGray};
  font-family: "MontserratRegular";
  font-size: 14px;
  line-height: 22px;
  margin-top: 16px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 44px;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.light.blue};
  border-radius: 16px;
  margin-top: 24px;
`;
