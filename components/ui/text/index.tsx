import { TextCustom } from "./styles";

type FontLine = 12 | 14 | 16 | 18 | 20 | 22 | 24 | 32 | 40;

interface TextProps {
  title: string;
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
}: TextProps) {
  const objectFont = {
    regular: "MontserratRegular",
    bold: "MontserratBold",
    "semi-bold": "MontserratSemiBold",
  };

  return (
    <TextCustom
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
