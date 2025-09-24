import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  margin-top: 64px;
  padding-left: 40px;
  padding-right: 40px;
  flex-direction: row;
  justify-content: space-between;

`;

export const Content = styled.View`
  padding-left: 40px;
  padding-right: 40px;
  margin-top: 24px;
`;

export const ContainerBody = styled.View`
  width: 100%;

  background-color: ${Colors.light.background};
  padding: 32px;
`;

export const BorderContainer = styled.TouchableOpacity`
  width: 84px;
  height: 84px;
  border-radius: 28px;
  border-color: ${Colors.light.blueLight};
  border-width: 2px;
  align-items: center;
  justify-content: center;
`;

export const Thumbnail = styled(Image)`
  width: 66px;
  height: 66px;
  border-radius: 16px;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const ContentText = styled.View`
  width: 60%;
  margin-left: 24px;
  gap: 8px;
`;

export const ContainerAbout = styled.View`
  margin-top: 24px;
  gap: 8px;
  padding-bottom: 32px;
`;

export const ContainerInfo = styled.View`
  align-items: center;
`;

export const ContentInfo = styled.View`
  width: 231px;
  height: 68px;
  background-color: ${Colors.light.blue};
  border-radius: 16px;
  margin-top: -40px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const ColumnInfo = styled.TouchableOpacity`
  width: 77px;
  height: 58px;
  align-items: center;
  justify-content: center;
`;

export const ButtonFollow = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: ${Colors.light.blue};
  align-items: center;
  justify-content: center;
`;

export const ButtonMessage = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border-width: 2px;
  border-color: ${Colors.light.blue};
  align-items: center;
  justify-content: center;
`;

export const ButtonDelete = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  background-color: ${Colors.light.background};
  border-color: ${Colors.light.red};
  border-width: 2px;
  align-items: center;
  justify-content: center;
`;
