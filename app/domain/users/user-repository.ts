import type { UserDTO, UserInput } from ".";

export interface UserRepository {
  create(user: UserInput): Promise<UserDTO>;
}
