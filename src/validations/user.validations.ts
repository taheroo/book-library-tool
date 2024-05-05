import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  points: z.number().int().default(0),
});
