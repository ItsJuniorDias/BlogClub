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

interface InputProps {
  thumbnail: string;
  setThumbnail: (item: string) => void;
}

const formSchema = z.object({
  title: z.string("* Required field"),
  description: z.string("* Required field"),
  article: z.string("* Required field"),
});

type FormData = z.infer<typeof formSchema>;

export default function InputBody({ thumbnail, setThumbnail }: InputProps) {
  const queryClient = useQueryClient();

  const auth = getAuth();
  const user = auth.currentUser;

  console.log(user?.uid, "USER");

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
        hours: 4,
        numberLike: 5.4,
        isLike: false,
        foreign_key: user?.uid,
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
      setThumbnail("");

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
    },
  });

  return (
    <Container>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <InputCustom
            placeholder="The art of beign an artist"
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
            placeholder="Simplified products"
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

          <Tag title="Art" />

          <Tag title="Design" />
        </Row>

        <Row>
          <Tag title="Culture" />

          <Tag title="Production" />
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
