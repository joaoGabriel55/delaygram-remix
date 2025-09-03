import { redirect } from "react-router";
import { createUserSession, getUserId } from "~/services/session.server";
import type { Route } from "./+types/sign-in";
import { SignIn } from "~/components/sign-in/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);

  if (userId) {
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  let response: Response;

  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Check the user's credentials
    if (email !== "aaron@mail.com" || password !== "password") {
      throw new Error("Invalid email or password");
    }

    // Create a session
    response = await createUserSession({
      request,
      userId: email,
      remember: true,
    });

    if (!response) {
      throw new Error("An error occurred while creating the session");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }

  throw response;
}

export default function SignInPage({ actionData }: Route.ComponentProps) {
  return <SignIn error={actionData?.error} />;
}
