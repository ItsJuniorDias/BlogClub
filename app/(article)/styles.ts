import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.light.background};
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: 32px;
  margin-bottom: 24px;
  padding-left: 40px;
  padding-right: 40px;
`;

export const ButtonBack = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
`;

export const ContentTitle = styled.View`
  padding-left: 40px;
  padding-right: 40px;
`;

export const ContentInfo = styled.View`
  width: 100%;
  padding-left: 40px;
  padding-right: 40px;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 32px;
`;

export const Row = styled.View`
  flex-direction: row;
  gap: 32px;
`;

export const Thumbnail = styled(Image)`
  width: 38px;
  height: 38px;
  margin-right: -16px;
  border-radius: 8px;
`;

export const ContentText = styled.View`
  gap: 6px;
`;

export const Body = styled.View`
  margin-top: 24px;
  padding-bottom: 96px;
`;

export const ImageBody = styled(Image)`
  width: 100%;
  height: 219px;
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`;

export const BodyText = styled.View`
  margin-top: 32px;
  padding-left: 40px;
  padding-right: 40px;
  gap: 16px;
`;

export const ContentFloat = styled.View`
  width: 100%;
  /* height: 116px; */
  align-items: flex-end;
  padding-right: 40px;
  background-color: ${Colors.light.background};
`;

export const ButtonFloat = styled.TouchableOpacity`
  width: 111px;
  height: 48px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.light.blue};
  position: absolute;
  margin-top: -96px;
  margin-right: 40px;
  gap: 8px;
  border-radius: 12px;
`;
