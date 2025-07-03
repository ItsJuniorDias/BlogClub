import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";

const windowWidth = Dimensions.get("window").width;

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.light.blue};
`;

export const BackgroundImage = styled.Image`
  width: ${windowWidth};
  border-bottom-left-radius: 32px;
  border-bottom-right-radius: 32px;
`;

export const ContentBlur = styled(BlurView)`
  width: 295px;
  height: 200px;
  overflow: hidden;
  position: absolute;
  border-radius: 20px;
  padding: 32px;
  gap: 16px;
  margin-bottom: 40px;
  margin-top: 432px;
`;

export const ContentProgress = styled.View`
  position: absolute;
  z-index: 5;
  width: 100%;
  margin-top: 64px;
  padding-left: 40px;
  padding-right: 40px;
  flex-direction: row;
`;

export const ContentHeader = styled.View`
  width: 100%;
  position: absolute;
  z-index: 2;
  /* background-color: red; */
  flex-direction: row;
  padding-left: 40px;
  padding-right: 40px;
  justify-content: space-between;
  align-items: center;
  margin-top: 96px;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const Thumbnail = styled.Image`
  width: 51px;
  height: 51px;
`;

export const ContentText = styled.View`
  /* background-color: green; */
  margin-left: 16px;
  gap: 8px;
`;
