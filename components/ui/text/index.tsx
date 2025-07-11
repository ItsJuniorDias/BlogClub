import { TextProps } from "react-native";

import { TextCustom } from "./styles";

type FontLine = 12 | 14 | 16 | 18 | 20 | 22 | 24 | 32 | 40;

interface TextPropsCustom extends TextProps {
  title: string | undefined;
  fontFamily: "regular" | "bold" | "semi-bold";
  numberOfLines?: number;
  fontSize: FontLine;
  lineHeight?: FontLine;
  color: string;
}

export default function Text({
  title,
  color,
  numberOfLines,
  fontFamily,
  fontSize,
  lineHeight,
  ...props
}: TextPropsCustom) {
  const objectFont = {
    regular: "MontserratRegular",
    bold: "MontserratBold",
    "semi-bold": "MontserratSemiBold",
  };

  return (
    <TextCustom
      {...props}
      fontFamily={objectFont[fontFamily]}
      fontSize={fontSize}
      numberOfLines={numberOfLines}
      color={color}
      lineHeight={lineHeight}
    >
      {title}
    </TextCustom>
  );
}
