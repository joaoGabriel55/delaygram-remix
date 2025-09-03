import { redirect } from "react-router";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";
import { getUserId } from "~/services/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delaygram" },
    { name: "description", content: "Welcome to Delaygram!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);

  return { userId };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return <Welcome userId={loaderData.userId} />;
}
