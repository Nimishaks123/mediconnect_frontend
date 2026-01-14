import {z} from "zod";
export const forgotPasswordSchema=z.object({
    email:z
    .string()
    .min(1,"Email is required")
    .email("Invalid Email Format")
});
export type forgotPasswordData=z.infer<typeof forgotPasswordSchema>
