export interface DashboardOverview {
  totalRevenue: number;
  platformRevenue: number;
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
}

export interface RevenueTrendItem {
  month: string;
  revenue: number;
}

export interface AppointmentStatusAnalyticsItem {
  status: string;
  count: number;
}