export interface DoctorUser {
  id: string;
  name: string;
  email: string;
}

export interface PendingDoctor {
  user: DoctorUser;
  specialty?: string;
  qualification?: string;
  experience?: number;
  onboardingStatus?: string;
}
