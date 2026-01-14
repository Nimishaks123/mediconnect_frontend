import { z } from "zod";

export const doctorBasicInfoSchema = z.object({
  specialty: z.string().min(1, "Specialty is required"),

  qualification: z.string().min(1, "Qualification is required"),

  experience: z.string().min(1, "Experience is required")
    .transform(Number)
    .refine((v) => !isNaN(v) && v >= 0, {
      message: "Experience must be 0 or more",
    }),

  consultationFee: z
    .string()
    .min(1, "Consultation fee is required")
    .transform(Number)
    .refine((v) => !isNaN(v), {
      message: "Consultation fee must be a number",
    })
    .refine((v) => v > 0, {
      message: "Consultation fee must be greater than 0",
    }),

  registrationNumber: z.string().min(1, "Registration number is required"),

  aboutMe: z.string().min(10, "About me must be at least 10 characters"),
});

export type DoctorBasicInfoData = z.infer<typeof doctorBasicInfoSchema>;
