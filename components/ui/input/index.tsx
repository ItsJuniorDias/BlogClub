import { useState } from "react";
import { KeyboardTypeOptions, TextInputProps } from "react-native";

import { Text } from "../../ui";

import { Container, InputCustom } from "./styles";
import { Colors } from "@/constants/Colors";
import { FieldError } from "react-hook-form";

interface InputPros extends TextInputProps {
  title: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  errors: FieldError | undefined;
}

export default function Input({
  value,
  onChangeText,
  title,
  placeholder,
  keyboardType,
  secureTextEntry,
  errors,
}: InputPros) {
  return (
    <Container>
      {title && (
        <Text
          title={title}
          fontFamily="regular"
          fontSize={14}
          color={Colors.light.darkBlue}
        />
      )}

      <InputCustom
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.light.darkBlue}
        secureTextEntry={secureTextEntry}
        isError={errors?.message}
      />

      {errors?.message && (
        <Text
          title={errors?.message}
          fontFamily="regular"
          fontSize={14}
          color={"red"}
        />
      )}
    </Container>
  );
}
