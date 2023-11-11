import { z } from "zod";

export const authSchema = z.object({
  email: z.string(),
  // Passwords must be at least 4 characters long.
  password: z.string().min(4),
});
