import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
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

export const Row = styled.View`
  flex-direction: row;
`;

export const Thumbnail = styled(Image)`
  width: 44px;
  height: 44px;
  border-radius: 8px;
`;

export const ContentText = styled.View`
  padding-left: 8px;
  gap: 8px;
`;

export const FooterText = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: 8px;
`;
