import { z } from "zod";

export const DoctorProfileSchema = z.object({
  specialty: z
    .string()
    .trim()
    .min(3, "Specialty must be at least 3 characters")
    .max(50, "Specialty cannot exceed 50 characters")
  .regex(
  /^[A-Za-z\s&-]+$/,
  "Specialty contains invalid characters"
),

  qualification: z
    .string()
    .trim()
    .min(2, "Qualification is required")
    .max(100, "Qualification cannot exceed 100 characters")
    .regex(
      /^[A-Za-z0-9\s.,()/-]+$/,
      "Qualification contains invalid characters"
    ),

experience: z.coerce
  .number()
  .int(
    "Experience must be a whole number"
  )
  .min(
    0,
    "Experience cannot be negative"
  )
  .max(
    60,
    "Experience cannot exceed 60 years"
  ),
 consultationFee: z.coerce
  .number()
  .int(
    "Consultation fee must be a whole number"
  )
  .min(
    100,
    "Minimum consultation fee is ₹100"
  )
  .max(
    10000,
    "Maximum consultation fee is ₹10000"
  ),
  aboutMe: z
    .string()
    .trim()
    .min(20, "About Me must be at least 20 characters")
    .max(1000, "About Me cannot exceed 1000 characters")
    .refine(
      (value) => !/^\d+$/.test(value),
      {
        message: "About Me cannot contain only numbers",
      }
    ),
});