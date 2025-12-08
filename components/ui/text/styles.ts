import styled from "styled-components/native";

type FontLine = 14 | 16 | 18 | 22 | 24 | 32 | 40;

type TextCustomProps = {
  fontFamily: "regular" | "bold" | "semi-bold";
  fontSize: FontLine;
  lineHeight: FontLine;
  color: string;
};

export const TextCustom = styled.Text<TextCustomProps>`
  font-family: "${props => props.fontFamily}";
  font-size: ${({ fontSize }) => fontSize}px;
  color: ${({ color }) => color};
  line-height: ${({ lineHeight }) => `${lineHeight}`};
`;
