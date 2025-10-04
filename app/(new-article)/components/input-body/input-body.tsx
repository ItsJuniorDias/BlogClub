import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Tag, Text, Button, Input } from "@/components/ui";

import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Container,
  ContentTag,
  InputArticle,
  InputCustom,
  InputProduct,
  Row,
} from "./styles";
import { getAuth } from "firebase/auth";
import { useState } from "react";

interface InputProps {
  thumbnail: string;
  setThumbnailRef: React.RefObject<string>;
}

interface StateTypeProps {
  type: "technology" | "adventure" | "philosophy";
}

const formSchema = z.object({
  title: z.string({ required_error: "* Required field" }),
  description: z.string({ required_error: "* Required field" }),
  article: z.string({ required_error: "* Required field" }),
});

type FormData = z.infer<typeof formSchema>;

export default function InputBody({ thumbnail, setThumbnailRef }: InputProps) {
  const [valueType, setValueType] = useState<StateTypeProps>({
    type: "technology",
  });

  const [checked, setChecked] = useState({
    technology: true,
    adventure: false,
    philosophy: false,
  });

  const queryClient = useQueryClient();

  const auth = getAuth();
  const user = auth.currentUser;

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Formulário válido:", data);

      const docRef = await addDoc(collection(db, "posts"), {
        title: data.title,
        description: data.description,
        thumbnail: thumbnail,
        article: data.article,
        hours: 0,
        numberLike: 0,
        isLike: false,
        foreign_key: user?.uid,
        type: valueType.type,
        createdAt: new Date(),
      });

      Toast.show({
        type: "success",
        text1: "Post create success",
        position: "top",
        text1Style: {
          fontFamily: "MontserratSemiBold",
          color: Colors.light.darkBlue,
          fontSize: 14,
        },
      });

      setValue("title", "");
      setValue("description", "");
      setValue("article", "");

      setThumbnailRef.current === "";

      console.log("Documento criado com ID: ", docRef.id);
    } catch (e) {
      console.error("Erro ao adicionar documento: ", e);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit(onSubmit),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      queryClient.invalidateQueries({ queryKey: ["repoData"] });
    },
  });

  return (
    <Container>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <InputCustom
            placeholder="Write the title of the article"
            onChangeText={(item) => {
              onChange(item);

              if (errors.title) {
                clearErrors("title");
              }
            }}
            value={value}
            placeholderTextColor={Colors.light.darkBlue}
            isError={!!errors.title}
          />
        )}
      />

      {errors.title && (
        <Text
          title={errors.title.message}
          fontFamily="regular"
          fontSize={14}
          color="red"
        />
      )}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <InputProduct
            onChangeText={(item) => {
              onChange(item);

              if (errors.description) {
                clearErrors("description");
              }
            }}
            value={value}
            placeholder="Write the subtitle"
            placeholderTextColor={Colors.light.darkBlue}
            isError={!!errors.description}
          />
        )}
      />

      {errors.description && (
        <Text
          title={errors.description.message}
          fontFamily="regular"
          fontSize={14}
          color="red"
        />
      )}

      <ContentTag>
        <Row>
          <TouchableOpacity onPress={() => {}}>
            <Text
              title="Add Tags"
              fontFamily="semi-bold"
              fontSize={14}
              color={Colors.light.blue}
            />
          </TouchableOpacity>

          <Row>
            <Tag
              isChecked={checked.technology}
              onPress={(item) => {
                setValueType((prevState) => ({
                  ...prevState,
                  type: item,
                }));

                setChecked((prevState) => ({
                  ...prevState,
                  technology: true,
                  adventure: false,
                  philosophy: false,
                }));
              }}
              title="technology"
            />

            <Tag
              isChecked={checked.adventure}
              onPress={(item) => {
                setValueType((prevState) => ({
                  ...prevState,
                  type: item,
                }));

                setChecked((prevState) => ({
                  ...prevState,
                  adventure: true,
                  technology: false,
                  philosophy: false,
                }));
              }}
              title="adventure"
            />

            <Tag
              isChecked={checked.philosophy}
              onPress={(item) => {
                setValueType((prevState) => ({
                  ...prevState,
                  type: item,
                }));

                setChecked((prevState) => ({
                  ...prevState,
                  philosophy: true,
                  technology: false,
                  adventure: false,
                }));
              }}
              title="philosophy"
            />
          </Row>
        </Row>
      </ContentTag>

      <Controller
        control={control}
        name="article"
        render={({ field: { onChange, value } }) => (
          <InputArticle
            value={value}
            onChangeText={(item) => {
              onChange(item);

              if (errors.article) {
                clearErrors("article");
              }
            }}
            placeholderTextColor={Colors.light.darkBlue}
            placeholder="Article Content"
            multiline={true}
            numberOfLines={10}
            textAlignVertical="top"
            isError={!!errors.article}
          />
        )}
      />

      {errors.article && (
        <Text
          title={errors.article.message}
          fontFamily="regular"
          fontSize={14}
          color="red"
        />
      )}

      <Button
        isLoading={isPending}
        title="CREATE NEW POST"
        style={{ marginBottom: 120 }}
        onPress={() => mutate({})}
      />
    </Container>
  );
}
