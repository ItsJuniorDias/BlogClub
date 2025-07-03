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
`;
