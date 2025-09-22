import type { UserDTO, UserInput } from "~/domain/users";
import { HttpClient } from "../lib/http-client";

export const userService = {
  async create(user: UserInput): Promise<UserDTO> {
    const httpClient = HttpClient();

    const response = await httpClient.post<UserDTO>("/api/users", user);

    return response.data;
  },
};
