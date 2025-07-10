import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, ContentButton } from "./styles";
import { Button, Input } from "@/components/ui";

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
        {...register("name")}
        onChangeText={(text) => setValue("name", text)}
        title="Name"
        placeholder="Enter with name"
        keyboardType="default"
        errors={errors.name}
      />

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

      <Input
        {...register("confirmPassword")}
        onChangeText={(text) => setValue("confirmPassword", text)}
        title="Confirm password"
        placeholder="Enter with password"
        keyboardType="default"
        errors={errors.confirmPassword}
      />

      <ContentButton>
        <Button title="LOGIN" onPress={handleSubmit(onSubmit)} />
      </ContentButton>
    </Container>
  );
}
