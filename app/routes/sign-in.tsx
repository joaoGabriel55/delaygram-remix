import { redirect } from "react-router";
import { SignIn } from "~/components/sign-in/sign-in";
import { authenticator, createUserSession, getUser } from "~/services/auth.server";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await getUser(request)) {
    return redirect("/");
  }
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const user = await authenticator.authenticate("user-pass", request);

    return await createUserSession({
      request,
      user,
      remember: true,
      redirectUrl: "/",
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    throw error;
  }
}

export default function SignInPage({ actionData }: Route.ComponentProps) {
  return <SignIn error={actionData?.error} />;
}
