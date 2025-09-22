import { Feed } from "~/components/feed/feed";
import { postService } from "~/infrastructure/posts/post-service";
import type { Route } from "./+types/feed";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delaygram - Feed" },
    { name: "description", content: "Welcome to Delaygram!" },
  ];
}

export async function loader() {
  const posts = await postService.findAll();

  return { posts, apiURL: process.env.API_URL };
}

export default function FeedPage({ loaderData }: Route.ComponentProps) {
  return <Feed posts={loaderData.posts} apiURL={loaderData.apiURL || ""} />;
}
