import React from "react";
import { TextProps as RNTextProps } from "react-native";
import { TextCustom } from "./styles";

type FontLine = 12 | 14 | 16 | 18 | 20 | 22 | 24 | 32 | 40;

interface TextPropsCustom extends RNTextProps {
  title?: string | undefined | null | number; // aceitar números também, caso passe sem querer
  fontFamily: "regular" | "bold" | "semi-bold";
  numberOfLines?: number;
  fontSize: FontLine;
  lineHeight?: FontLine;
  color?: string;
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
  } as const;

  // Garante que temos sempre uma string segura
  const safeTitle = title == null ? "" : String(title);

  const parseBoldText = (text: string) => {
    // split preservando grupos entre **...**
    // se não houver **, o array terá apenas [text]
    const parts = text.split(/\*\*(.*?)\*\*/g);

    return parts.map((part, index) => {
      const isBold = index % 2 === 1;

      return (
        <TextCustom
          // key único
          key={index}
          // passa props de estilo via attrs/style no TextCustom (ver nota)
          fontFamily={isBold ? objectFont.bold : objectFont[fontFamily]}
          fontSize={fontSize}
          lineHeight={lineHeight}
          color={color}
        >
          {part}
        </TextCustom>
      );
    });
  };

  return (
    // TextCustom pai para suportar numberOfLines/cutoff no React Native
    <TextCustom
      {...props}
      numberOfLines={numberOfLines}
      fontFamily={objectFont[fontFamily]}
      fontSize={fontSize}
      lineHeight={lineHeight}
      color={color}
    >
      {parseBoldText(safeTitle)}
    </TextCustom>
  );
}
