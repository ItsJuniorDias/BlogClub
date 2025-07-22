import { Image } from "expo-image";
import styled from "styled-components/native";

export const Container = styled.View``;

export const ContentButton = styled.View`
  margin-top: 32px;
`;

export const ContentText = styled.TouchableOpacity`
  width: 100%;

  flex-direction: row;
  gap: 8;
  justify-content: center;
  margin-top: 24px;
`;

export const FooterSocial = styled.View`
  width: 100%;
  align-items: center;
  margin-top: 32px;
  gap: 16px;
`;

export const RowSocial = styled.View`
  flex-direction: row;
  gap: 32px;
`;

export const Social = styled(Image)`
  width: 36px;
  height: 36px;
`;
