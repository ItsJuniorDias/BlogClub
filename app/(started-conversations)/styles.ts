import { Colors } from "@/constants/Colors";
import { GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: "#f2f2f2";
  padding-top: 64px;
  padding-left: 24px;
  padding-right: 24px;
`;

export const ButtonContent = styled(GlassView)`
  width: 44px;
  height: 44px;
  /* border-color: ${Colors.light.darkBlue};
  border-width: 2px; */
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
  justify-content: space-between;
`;

export const Thumbnail = styled(Image)`
  width: 44px;
  height: 44px;
  border-radius: 8px;
`;

export const ContentText = styled.View`
  padding-left: 8px;
  padding-right: 8px;
  gap: 8px;
`;

export const Content = styled.View`
  flex-direction: row;
  gap: 16px;
`;

export const ContentNotification = styled.View`
  flex-direction: row;
  width: 32px;
  height: 32px;
  justify-content: flex-end;
`;

export const Pointer = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 50px;
  background-color: red;
  position: absolute;
`;

export const FooterText = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: 8px;
`;
