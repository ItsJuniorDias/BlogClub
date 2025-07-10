import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Container, ContentButton } from "./styles";
import { Button, Input } from "@/components/ui";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";

const schema = z.object({
  email: z
    .string("* Required field")
    .email({ message: "Invalid email address" }),
  password: z
    .string("* Required field")
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type FormData = z.infer<typeof schema>;

export default function InputLogin() {
  const auth = getAuth();

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    return signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user) {
          router.push("/(tabs)");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        Alert.alert(errorCode, errorMessage, [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: handleSubmit(onSubmit),
    onSuccess: () => {},
  });

  return (
    <Container>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={(text) => {
              onChange(text);

              if (errors.email) {
                clearErrors("email");
              }
            }}
            title="E-mail"
            placeholder="Enter with e-mail"
            keyboardType="email-address"
            errors={errors.email}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={(text) => {
              onChange(text);

              if (errors.password) {
                clearErrors("password");
              }
            }}
            title="Password"
            placeholder="Enter with password"
            keyboardType="visible-password"
            secureTextEntry
            errors={errors.password}
          />
        )}
      />

      <ContentButton>
        <Button
          isLoading={isPending}
          title="LOGIN"
          onPress={() => mutate({})}
        />
      </ContentButton>
    </Container>
  );
}
