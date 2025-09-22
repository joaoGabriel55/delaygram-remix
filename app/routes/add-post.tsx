import { type FileUpload, parseFormData } from "@remix-run/form-data-parser";
import { redirect } from "react-router";
import { AddPost } from "~/components/add-post/add-post";
import { postService } from "~/infrastructure/posts/post-service";
import { getUserToken } from "~/services/auth.server";
import type { Route } from "./+types/add-post";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Delaygram - Add Post" },
    { name: "description", content: "Welcome to Delaygram!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userToken = await getUserToken(request);

  if (!userToken) {
    return redirect("/sign-in");
  }
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const userToken = await getUserToken(request);

    if (!userToken) {
      return redirect("/sign-in");
    }

    // const formData = await request.formData();
    async function uploadHandler(fileUpload: FileUpload) {
      if (fileUpload.fieldName === "image") {
        return fileUpload;
      }
    }

    const formData = await parseFormData(request, uploadHandler);

    await postService.create(
      {
        image: formData.get("image") as File,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        userId: "1",
      },
      userToken,
    );

    return redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      if ("status" in error && error.status === 401) {
        throw redirect("/sign-in");
      }

      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }
}

export default function AddPostPage({ actionData }: Route.ComponentProps) {
  return <AddPost error={actionData?.error} />;
}
