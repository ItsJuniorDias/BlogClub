import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  padding-left: 24px;
  padding-right: 24px;
`;

export const Thumbnail = styled(Image)`
  width: 150px;
  height: 240px;
  border-radius: 24px;
  margin-right: 16px;
  margin-top: 16px;
`;

export const Row = styled.View`
  width: 100%;
  align-items: flex-end;
`;

export const RowItem = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const Touchable = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

export const TouchableSkeleton = styled.TouchableOpacity`
  width: 150px;
  height: 240px;
  border-radius: 24px;
  margin-right: 16px;
  margin-top: 16px;
  background-color: #ddd;
`;

export const ContentInput = styled.View`
  margin-bottom: 8px;
  border-radius: 50px;
`;

export const Checked = styled(Image)`
  width: 80px;
  height: 80px;
  position: absolute;
`;
