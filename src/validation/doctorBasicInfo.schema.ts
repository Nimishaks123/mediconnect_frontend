import { z } from "zod";

export const doctorBasicInfoSchema = z.object({
  specialty: z.string().trim().min(2, "Specialty must be at least 2 characters"),

  qualification: z.string().trim().min(2, "Qualification must be at least 2 characters"),

  experience: z.string().trim().min(1, "Experience is required")
    .transform(Number)
    .refine((v) => !isNaN(v) && v >= 0 && v <= 60, {
      message: "Experience must be between 0 and 60",
    }),

  consultationFee: z
    .string()
    .trim()
    .min(1, "Consultation fee is required")
    .transform(Number)
    .refine((v) => !isNaN(v) && v >= 100 && v <= 10000, {
      message: "Fee must be between ₹100 and ₹10000",
    }),

  registrationNumber: z.string().trim().min(5, "Registration number must be at least 5 characters")
    .regex(/^[A-Z0-9-]+$/, "Register number must be alphanumeric or hyphen (Uppercase only)"),

  aboutMe: z.string().trim().min(20, "About me must be at least 20 characters").max(500, "Maximum 500 characters allowed"),
});

export type DoctorBasicInfoData = z.infer<typeof doctorBasicInfoSchema>;
