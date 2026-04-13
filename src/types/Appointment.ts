export type Appointment = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "CONFIRMED" | "PAYMENT_PENDING" | "CANCELLED";
  createdAt: string;

  // doctor: {
  //   id: string;
  //   name: string;
  //   specialty?: string;
  //   profilePhoto?: string | null;
  // } | null;

doctor: {
  id: string;
  name: string;
  specialization?: string;
  profile: string | null;
} | null;
};