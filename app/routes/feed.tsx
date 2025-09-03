import { redirect } from "react-router";
import { Feed } from "~/components/feed/feed";
import { getUserId } from "~/services/session.server";
import type { Route } from "./+types/feed";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delaygram - Feed" },
    { name: "description", content: "Welcome to Delaygram!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/sign-in");
  } else {
    return { userId };
  }
}

export default function FeedPage({ loaderData }: Route.ComponentProps) {
  return <Feed />;
}
