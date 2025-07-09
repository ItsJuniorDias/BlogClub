import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.ScrollView`
  flex: 1;
  padding-top: 96px;
  background-color: ${Colors.light.background};
`;

export const Header = styled.View`
  width: 100%;
  align-items: center;
`;

export const Logo = styled(Image)`
  width: 110px;
  height: 56px;
`;

export const Tabs = styled.View`
  width: 100%;
  height: 104px;
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
  background-color: ${Colors.light.blue};
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 32px;
`;

export const Touchable = styled.TouchableOpacity`
  margin-top: -16px;
`;

export const Body = styled.View`
  width: 100%;
  background-color: ${Colors.light.background};
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 32px;
  margin-top: -28px;
`;
