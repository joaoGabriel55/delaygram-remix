import z from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export const UserInputSchema = UserSchema.omit({ id: true });
export type UserInput = z.infer<typeof UserInputSchema>;

const UserDTOSchema = UserSchema.omit({ password: true });
export type UserDTO = z.infer<typeof UserDTOSchema>;
