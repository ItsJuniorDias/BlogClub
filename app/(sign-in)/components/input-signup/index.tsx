import { useForm, Controller } from "react-hook-form";
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
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: FormData) => {
    console.log("Dados válidos Login:", data);
  };

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
        <Button title="LOGIN" onPress={handleSubmit(onSubmit)} />
      </ContentButton>
    </Container>
  );
}
