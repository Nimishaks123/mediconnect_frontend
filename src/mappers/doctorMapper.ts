import type { Doctor } from "../types/Doctor";
import type { VerifiedDoctorApi } from "../types/VerifiedDoctorApi";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";

export const mapDoctorFromApi = (
  d: VerifiedDoctorApi
): Doctor => {
  const doctorWithId = d as VerifiedDoctorApi & { id?: string };
  
  // Handle both backend naming (profilePhoto) and frontend expectation
  const photo = d.profilePhoto || (d as any).photo;

  return {
    doctorId: d.doctorId || doctorWithId.id || "",
    id: d.id,
    userId: d.userId,
    name: d.name,
    specialty: d.specialty,
    aboutMe: d.aboutMe || (d as any).about || "",
    profilePhoto: photo?.trim() ? photo : DEFAULT_AVATAR,
    qualification: d.qualification || "",
    experience: d.experience || 0,
    consultationFee: d.consultationFee || 0,
    registrationNumber: d.registrationNumber || "",
    licenseDocument: d.licenseDocument || null,
    certifications: d.certifications || [],
    verificationStatus: d.verificationStatus || "PENDING",
    rejectionReason: d.rejectionReason || null,
  };
};
