export type VerifiedDoctorApi = {
  doctorId: string;
  id?: string;
  userId: string;
  name: string;
  specialty: string;
  aboutMe: string;
  profilePhoto: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  registrationNumber: string;
  licenseDocument: string | null;
  certifications: string[];
  verificationStatus: string;
  rejectionReason: string | null;
};
