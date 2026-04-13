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
  getAdminDoctors: (params: { 
    status: string;
    page: number; 
    limit: number; 
    search?: string; 
    sort?: string 
  }) => 
    api.get<{ 
      total: number; 
      doctors: PendingDoctor[];
      pagination: {
        page: number;
        limit: number;
        totalPages: number;
        total: number;
      }
    }>("/admin/doctors", { params }),

  approveDoctor: (userId: string) =>
    api.post("/admin/approve-doctor", { userId }),

  rejectDoctor: (userId: string, reason: string) =>
    api.post("/admin/reject-doctor", { userId, reason }),
};
