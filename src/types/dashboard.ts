export interface DashboardStats {
  appointments: number;
  walletBalance: number;
  unreadMessages: number;
  prescriptions: number;
}

export interface UpcomingAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  experience: string;
  date: string;
  time: string;
  meetingLink?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  upcomingAppointment: UpcomingAppointment | null;
  activities: Activity[];
}