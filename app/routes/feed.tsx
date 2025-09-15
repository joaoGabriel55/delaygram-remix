import { redirect } from "react-router";
import { Feed } from "~/components/feed/feed";
import type { Route } from "./+types/feed";
import { getUser } from "~/services/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delaygram - Feed" },
    { name: "description", content: "Welcome to Delaygram!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const user = await getUser(request);

  if (!user) {
    throw redirect("/sign-in");
  } else {
    return { userId: user.id };
  }
}

export default function FeedPage({ loaderData }: Route.ComponentProps) {
  return <Feed />;
}
