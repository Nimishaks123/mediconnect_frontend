import { z } from "zod";

export const ReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Please select a rating")
    .max(5, "Rating cannot exceed 5"),

  comment: z
    .string()
    .trim()
    .min(
      5,
      "Comment must be at least 5 characters"
    )
    .max(
      500,
      "Comment cannot exceed 500 characters"
    ),
});

export type ReviewFormData =
  z.infer<typeof ReviewSchema>;