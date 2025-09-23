import type { Post, PostInput } from "~/domain/posts";
import { HttpClient } from "../lib/http-client";

export const postService = {
  async create(post: PostInput, token: string): Promise<void> {
    const httpClient = HttpClient();

    const formData = new FormData();
    formData.append("image", post.image);
    formData.append("title", post.title);
    formData.append("description", post.description);
    formData.append("userId", post.userId);

    await httpClient.post<Post>("/api/posts", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async findAll(): Promise<Post[]> {
    const httpClient = HttpClient();

    const response = await httpClient.get<Post[]>("/api/posts");

    return response.data;
  },
};
