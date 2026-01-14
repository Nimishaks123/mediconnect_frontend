export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  blocked: boolean;
  isVerified: boolean;
}
