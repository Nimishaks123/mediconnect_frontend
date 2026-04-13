import { api } from "./api";

export const adminAppointmentApi = {
  getAppointments: (params: { 
    page: number; 
    limit: number; 
    type: string; 
    status?: string; 
    search?: string; 
    sort?: string 
  }) =>
    api.get("/admin/appointments", { params }),
    
  getAppointmentDetails: (id: string) =>
    api.get(`/admin/appointments/${id}`),
};
