import {z} from "zod";
export const loginSchema=z.object({
    email:z
    .string()
    .min(1,"Email is required")
    .email("Invalid Email Format"),
    password:z
    .string()
    .min(1,"Password is required")
    .min(6,"Password must be atleast 6 characters long"),
    remember:z.boolean(),

});
export type LoginFormData=z.infer<typeof loginSchema>




