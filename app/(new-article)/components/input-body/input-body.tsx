import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Tag, Text, Button } from "@/components/ui";
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

// === Gemini Client ===
import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from "@react-native-async-storage/async-storage";

const genai = new GoogleGenerativeAI("");

export const model = genai.getGenerativeModel({
  model: "gemini-2.5-flash",
});

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

  const [isLoading, setIsLoading] = useState(false);

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
        thumbnail: setThumbnailRef.current,
        article: data.article,
        hours: 0,
        numberLike: 0,
        isLike: false,
        foreign_key: user?.uid,
        type: valueType,
        createdAt: new Date(),
        isMember: await getIsMember(),
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

  const YOUR_ACCESS_KEY = "-Jly_R_E6OQDhkCGJdYbdo8065H14QGir9VaDqSxumg"; // Substitua pela sua chave de acesso
  const CLIENT_ID_QUERY_PARAM = `client_id=${YOUR_ACCESS_KEY}`;

  const fetchUnsplashImageURL = async (
    tag?: string // 'tag' agora é opcional
  ): Promise<string | undefined> => {
    try {
      let url = `https://api.unsplash.com/photos/random?${CLIENT_ID_QUERY_PARAM}`;

      if (tag) {
        url += `&query=${tag}`; // Adiciona a query da tag se for fornecida
      }

      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Erro ao buscar imagem aleatória: ${response.status} ${response.statusText}`
        );
        return undefined;
      }

      const data = await response.json();

      // Para o endpoint random, a resposta é um único objeto de foto, não um array 'results'
      if (data && data.urls && data.urls.regular) {
        return data.urls.regular; // Retorna a URL da imagem regular
      } else {
        console.log(
          `Nenhuma imagem aleatória encontrada (ou para a tag: ${tag})`
        );
        return undefined;
      }
    } catch (error) {
      console.error(
        "Erro na requisição Unsplash para imagem aleatória:",
        error
      );
      return undefined;
    }
  };

  const getIsMember = async () => {
    try {
      const result = await AsyncStorage.getItem("isMember");

      return result;
    } catch (error) {
      console.log("Error saving isMember:", error);
    }
  };

  // === Generate article using Google Gemini ===
  const generateArticle = async (tag: string) => {
    const imageUrl = await fetchUnsplashImageURL(tag);

    const prompt = `You are a content creation assistant. 
      For the tag: "${tag}", create:
      1. An engaging title
      2. An description of approximately 10 words
      3. An article of approximately 500 words related to the tag, philosophy(Stoicism, Marcus Aurelius, Seneca, Epictetus), technology(AI, Machine Learning, Programming, JavaScript(Typescript), React, React Native), adventure(Travel, Exploration, Nature).
      5. make the return in this identical pattern
      { 
        "title":"",
        "description":"",
        "thumbnail":${imageUrl}, 
        "type":${tag}, 
        "article":"", 
        "foreign_key": "e0Q33RHZT5ajQiWy6vRyLfeEW2h2",
        "isMember": ${await getIsMember()}
        }`;

    try {
      const { response } = await model.generateContent(prompt);

      const { candidates } = response;

      if (!candidates || !candidates[0]?.content?.parts?.[0]?.text) {
        console.error(
          "No candidates or content returned from Gemini:",
          candidates
        );
        return null;
      }

      const content = candidates[0].content.parts[0].text;
      const cleanedContent = content.replace(/```json\n|\n```/g, "");

      try {
        return JSON.parse(cleanedContent);
      } catch {
        console.error("Error parsing Gemini output:", cleanedContent);
        return null;
      }
    } catch (err) {
      console.error("Error generating article with Gemini:", err);
      return null;
    }
  };

  const handleGenerateArticle = async () => {
    setIsLoading(true);
    const randomTag = tags[Math.floor(Math.random() * tags.length)];

    setValueType(randomTag);
    setChecked({
      technology: randomTag === "technology",
      adventure: randomTag === "adventure",
      philosophy: randomTag === "philosophy",
    });
    onChecked(randomTag);

    const result = await generateArticle(randomTag);

    setIsLoading(false);

    console.log(result, "RESULT");

    if (!result) {
      Toast.show({ type: "error", text1: "Error generating article" });
      return;
    }

    setValue("title", result.title);
    setValue("description", result.description);
    setValue("article", result.article);
    setThumbnailRef.current = result.thumbnail;
    Toast.show({ type: "success", text1: "Article generated automatically!" });

    mutate({});
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

      {/* <Button
        isLoading={isLoading}
        title="GENERATE ARTICLE WITH GEMINI"
        onPress={handleGenerateArticle}
      /> */}

      <Button
        isLoading={isPending}
        title="CREATE NEW POST"
        style={{ marginBottom: 120 }}
        onPress={() => mutate({})}
      />
    </Container>
  );
}
