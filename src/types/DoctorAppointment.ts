export interface DoctorAppointment {
  appointmentId: string;
  bookingId?: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status:
    | "COMPLETED"
    | "CANCELLED"
    | "CONFIRMED"
    | "PAYMENT_PENDING";

  paymentStatus:
    | "SUCCESS"
    | "REFUNDED"
    | "PENDING";

  videoCallAvailable: boolean;
}

export interface DoctorAppointmentsResponse {
  upcoming: DoctorAppointment[];
  past: DoctorAppointment[];
  recent: DoctorAppointment[];
}