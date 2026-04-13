import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const fileSchema = z
  .custom<File>((val) => val instanceof File, "File is required")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `Max file size is 5MB.`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Invalid format. Only JPG, PNG, WEBP and PDF are allowed."
  );

export const doctorDocumentsSchema = z.object({
  licenseDocument: fileSchema,

  profilePhoto: z
    .custom<File>((val) => val instanceof File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid format. Only JPG, PNG, WEBP and PDF are allowed."
    )
    .optional(),

  certifications: z
    .array(fileSchema)
    .max(5, "Maximum 5 certification documents allowed")
    .optional()
    .default([]),
});

export type DoctorDocumentsData = z.infer<typeof doctorDocumentsSchema>;
