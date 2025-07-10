import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Container, ContentButton } from "./styles";
import { Button, Input } from "@/components/ui";

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
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Dados válidos Login:", data);
  };

  return (
    <Container>
      <Input
        {...register("email")}
        onChangeText={(text) => setValue("email", text)}
        title="E-mail"
        placeholder="Enter with e-mail"
        keyboardType="email-address"
        errors={errors.email}
      />

      <Input
        {...register("password")}
        onChangeText={(text) => setValue("password", text)}
        title="Password"
        placeholder="Enter with password"
        keyboardType="visible-password"
        secureTextEntry
        errors={errors.password}
      />

      <ContentButton>
        <Button title="LOGIN" onPress={handleSubmit(onSubmit)} />
      </ContentButton>
    </Container>
  );
}
