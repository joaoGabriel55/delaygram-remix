import type { UserDTO, UserInput } from "~/domain/users";
import type { UserRepository } from "~/domain/users/user-repository";
import { HttpClient } from "../lib/http-client";

export const userRepository: UserRepository = {
  async create(user: UserInput): Promise<UserDTO> {
    const httpClient = HttpClient();

    const response = await httpClient.post<UserDTO>("/api/users", user);

    return response.data;
  },
};
