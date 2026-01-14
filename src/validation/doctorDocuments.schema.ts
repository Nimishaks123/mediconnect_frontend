import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileSchema = z
  .instanceof(File, { message: "File is required" })
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Invalid image format (jpg, jpeg, png, webp only)"
  );

export const doctorDocumentsSchema = z.object({
  licenseDocument: fileSchema,

  profilePhoto: z
    .instanceof(File)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid image format (jpg, jpeg, png, webp only)"
    )
    .optional(),

  certifications: z
    .array(fileSchema)
    .min(1, "At least one certification is required"),
});

export type DoctorDocumentsData = z.infer<
  typeof doctorDocumentsSchema
>;
