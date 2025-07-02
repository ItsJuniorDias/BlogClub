import styled from "styled-components/native";
import { Image } from "expo-image";

export const Container = styled.ScrollView`
  flex: 1;
  background-color: #f9faff;
  padding-top: 72px;
`;

export const Thumbnail = styled(Image)`
  width: 400px;
  height: 462px;
`;
