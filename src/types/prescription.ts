export interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionDoctor {
  name: string;
  specialty: string;
  registrationNumber: string;
}

export interface Prescription {
  prescriptionId: string;
  bookingId?: string;
  appointmentId: string;

  diagnosis: string;

  medicines: Medicine[];

  notes?: string;

  createdAt?: string;

  doctor: PrescriptionDoctor;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  diagnosis: string;
  medicines: Medicine[];
  notes?: string;
}