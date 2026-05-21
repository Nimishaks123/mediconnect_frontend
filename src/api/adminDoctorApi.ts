import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
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
    }>( API_ENDPOINTS.ADMIN_DOCTORS.GET_ALL, { params }),

  approveDoctor: (userId: string) =>
    api.post(API_ENDPOINTS.ADMIN_DOCTORS.APPROVE, { userId }),

  rejectDoctor: (userId: string, reason: string) =>
    api.post(API_ENDPOINTS.ADMIN_DOCTORS.REJECT, { userId, reason }),
};
