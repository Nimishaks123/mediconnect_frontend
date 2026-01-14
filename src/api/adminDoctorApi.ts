import { api } from "./api";

export interface PendingDoctor {
  doctor: {
    id: string;
    userId: string;
    specialty: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    registrationNumber: string;
    licenseDocument: string | null;
    certifications: string[];
    aboutMe: string;
    profilePhoto: string | null;
    onboardingStatus: string;
    verificationStatus: string;
    verifiedBy: string | null;
    verifiedAt: Date | null;
    rejectionReason: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    role: "DOCTOR";
    blocked: boolean;
    isVerified: boolean;
  };
}

export const adminDoctorApi = {
  getPendingDoctors: () => api.get<{ count: number; doctors: PendingDoctor[] }>("/admin/pending-doctors"),

  approveDoctor: (userId: string) =>
    api.post("/admin/approve-doctor", { userId }),

  rejectDoctor: (userId: string, reason: string) =>
    api.post("/admin/reject-doctor", { userId, reason }),
};
