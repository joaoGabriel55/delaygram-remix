import { redirect } from "react-router";
import { z } from "zod";
import { SignUp } from "~/components/sign-up/sign-up";
import { UserInputSchema } from "~/domain/users";
import { userService } from "~/infrastructure/users/user-service";
import type { Route } from "./+types/sign-up";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Create a new account" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();

    const email = formData.get("email");
    const password = formData.get("password");

    const parser = UserInputSchema.safeParse({
      email,
      password,
    });

    if (!parser.success) {
      return { error: z.prettifyError(parser.error) };
    }

    await userService.create(parser.data);

    return redirect("/sign-in");
  } catch (error) {
    console.error("Error signing up:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }

    throw error;
  }
}

export default function SignUpPage({ actionData }: Route.ComponentProps) {
  return <SignUp error={actionData?.error} />;
}
