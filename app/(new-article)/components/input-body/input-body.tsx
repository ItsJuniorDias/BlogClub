import { useEffect, useState } from "react";

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

import { OPENAI_API_KEY } from "@env";

interface InputProps {
  thumbnail: string;
  setThumbnailRef: React.RefObject<string>;
  onChecked: (item: string) => void;
}

const formSchema = z.object({
  title: z.string({ required_error: "* Required field" }),
  description: z.string({ required_error: "* Required field" }),
  article: z.string({ required_error: "* Required field" }),
});

type FormData = z.infer<typeof formSchema>;

const tags = ["technology", "adventure", "philosophy"];

export default function InputBody({
  thumbnail,
  setThumbnailRef,
  onChecked,
}: InputProps) {
  const [valueType, setValueType] = useState(tags[0]);
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

  useEffect(() => {
    onChecked(valueType);
  }, [valueType, onChecked]);

  useEffect(() => {
    const changeTagEveryHour = setInterval(() => {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      setValueType(randomTag);
      setChecked({
        technology: randomTag === "technology",
        adventure: randomTag === "adventure",
        philosophy: randomTag === "philosophy",
      });
    }, 3600000); // 1 hour

    return () => clearInterval(changeTagEveryHour);
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await addDoc(collection(db, "posts"), {
        title: data.title,
        description: data.description,
        thumbnail: thumbnail,
        article: data.article,
        hours: 0,
        numberLike: 0,
        isLike: false,
        foreign_key: user?.uid,
        type: valueType,
        createdAt: new Date(),
      });
      Toast.show({
        type: "success",
        text1: "Post created successfully",
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
      setThumbnailRef.current = "";
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit(onSubmit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["repoData"] });
    },
  });

  // === Generate article in English using GPT-3.5 Turbo ===
  const generateArticle = async (tag: string) => {
    const prompt = `You are a content creation assistant. 
      For the tag: "${tag}", create:
      1. An engaging title
      2. A captivating subtitle
      3. An article of approximately 200 words
      4. A thumbnail suggestion (keywords for image)
      Return it in JSON format:
      {"title":"","subtitle":"","thumbnail":"","content":""}`;

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // free model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      const data = await response.json();

      const content = data.choices[0].message.content;

      // Parse JSON safely
      try {
        return JSON.parse(content);
      } catch {
        console.error("Error parsing GPT output:", content);
        return null;
      }
    } catch (err) {
      console.error("Error generating article:", err);
      return null;
    }
  };

  const handleGenerateArticle = async () => {
    const result = await generateArticle(valueType);
    if (!result) {
      Toast.show({ type: "error", text1: "Error generating article" });
      return;
    }
    setValue("title", result.title);
    setValue("description", result.subtitle);
    setValue("article", result.content);
    setThumbnailRef.current = result.thumbnail;
    Toast.show({ type: "success", text1: "Article generated automatically!" });
  };

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
              if (errors.title) clearErrors("title");
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
              if (errors.description) clearErrors("description");
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
            {tags.map((tag) => (
              <Tag
                key={tag}
                isChecked={checked[tag as keyof typeof checked]}
                onPress={() => {
                  setValueType(tag);
                  setChecked({
                    technology: tag === "technology",
                    adventure: tag === "adventure",
                    philosophy: tag === "philosophy",
                  });
                  onChecked(tag);
                }}
                title={tag}
              />
            ))}
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
              if (errors.article) clearErrors("article");
            }}
            placeholderTextColor={Colors.light.darkBlue}
            placeholder="Article Content"
            multiline
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
