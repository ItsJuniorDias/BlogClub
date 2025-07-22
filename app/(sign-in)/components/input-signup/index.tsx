import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, ContentButton, ContenteText } from "./styles";
import { Button, Input, Text } from "@/components/ui";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Colors } from "@/constants/Colors";

const schema = z
  .object({
    name: z.string("* Required field").min(1, { message: "Name is required" }),
    email: z
      .string("* Required field")
      .email({ message: "Invalid email address" }),
    password: z
      .string("* Required field")
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z.string("* Required field"),
    profession: z.string("* Required field"),
    aboutMe: z.string("* Required field"),
  })
  .refine(
    (data) =>
      (!data.password && !data.confirmPassword) ||
      (data.password &&
        data.confirmPassword &&
        data.password === data.confirmPassword),
    {
      path: ["confirmPassword"],
      message: "Passwords do not match or are incomplete",
    }
  );

type FormData = z.infer<typeof schema>;

export default function InputSignUp() {
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

  const createUserInFirestore = async () => {
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userRef = doc(db, "users", uid);

      const userData = {
        id: uid,
        email: user.email,
        name: control._formValues.name,
        aboutMe: control._formValues.aboutMe,
        profession: control._formValues.profession,
        createdAt: new Date(),
      };

      await setDoc(userRef, userData, { merge: true });
    } else {
      console.error("No authenticated user found.");
    }
  };

  const onSubmit = async (data: FormData) => {
    return createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await createUserInFirestore();

        Alert.alert(
          "User document created/updated successfully.",
          "user created/updated with success",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                if (user) {
                  router.push("/(tabs)");
                }
              },
            },
          ]
        );
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
        name="name"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={(text) => {
              onChange(text);

              if (errors.name) {
                clearErrors("name");
              }
            }}
            title="Name"
            placeholder="Enter with name"
            keyboardType="default"
            errors={errors.name}
          />
        )}
      />

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
        name="profession"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={(text) => {
              onChange(text);

              if (errors.profession) {
                clearErrors("profession");
              }
            }}
            title="Profession"
            placeholder="Enter with Profession"
            keyboardType="default"
            errors={errors.profession}
          />
        )}
      />

      <Controller
        control={control}
        name="aboutMe"
        render={({ field: { onChange, value } }) => (
          <Input
            title="About me"
            value={value}
            onChangeText={(text) => {
              onChange(text);

              if (errors.aboutMe) {
                clearErrors("aboutMe");
              }
            }}
            multiline
            numberOfLines={5}
            placeholder="Enter with about me"
            keyboardType="default"
            errors={errors.aboutMe}
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <Input
            value={value}
            onChangeText={(text) => {
              onChange(text);

              if (errors.confirmPassword) {
                clearErrors("confirmPassword");
              }
            }}
            title="Confirm password"
            placeholder="Enter with password"
            keyboardType="default"
            secureTextEntry
            errors={errors.confirmPassword}
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
