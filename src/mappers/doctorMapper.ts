// src/mappers/doctorMapper.ts
import type { Doctor } from "../types/Doctor";
import type { VerifiedDoctorApi } from "../types/VerifiedDoctorApi";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff";

export const mapDoctorFromApi = (
  d: VerifiedDoctorApi
): Doctor => ({
  id: d.id,
  name: d.name,
  specialty: d.specialty,
  about: d.about,
  photo: d.photo?.trim() ? d.photo : DEFAULT_AVATAR,
});
