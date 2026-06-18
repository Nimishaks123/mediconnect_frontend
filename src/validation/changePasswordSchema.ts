import {z} from "zod";
export const changePasswordFormSchema=z.object({
    currentPassword:z.string()
    .min(1,"current password is required"),
    newPassword:z.string()
    .min(6,"Password must be atleast 6 characters long"),
    confirmPassword:z.string()
    .min(1,"confirm password is required"),
})
.refine((data)=>
data.newPassword===data.confirmPassword,
{path:["confirmPassword"],
    message:"Passwords do not match",
});
export type changePasswordFormData=z.infer<typeof changePasswordFormSchema>;