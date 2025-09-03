import { AddPost } from "~/components/add-post/add-post";
import type { Route } from "./+types/add-post";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delaygram - Add Post" },
    { name: "description", content: "Welcome to Delaygram!" },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  let response: Response | undefined;

  try {
    const formData = await request.formData();

    console.log(formData)

    if (!response) {
      throw new Error("An error occurred while creating the post");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }

  throw response;
}

export default function AddPostPage({ actionData }: Route.ComponentProps) {
  return <AddPost error={actionData?.error} />;
}
