import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1, { message: "Page must be at least 1" }).optional(),
  limit: z
    .number()
    .min(1, { message: "Limit must be at least 1" })
    .max(100, { message: "Limit must not exceed 100" })
    .optional(),
});
