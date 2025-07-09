import { useState } from "react";
import { KeyboardTypeOptions, TextInputProps } from "react-native";

import { Text } from "../../ui";

import { Container, InputCustom } from "./styles";
import { Colors } from "@/constants/Colors";

interface InputPros extends TextInputProps {
  title: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
}

export default function Input({
  value,
  onChangeText,
  title,
  placeholder,
  keyboardType,
  secureTextEntry,
}: InputPros) {
  return (
    <Container>
      <Text
        title={title}
        fontFamily="regular"
        fontSize={14}
        color={Colors.light.darkBlue}
      />

      <InputCustom
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.light.darkBlue}
        secureTextEntry={secureTextEntry}
      />
    </Container>
  );
}
