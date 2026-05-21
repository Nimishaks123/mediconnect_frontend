import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
export const adminAppointmentApi = {
  getAppointments: (params: { 
    page: number; 
    limit: number; 
    type: string; 
    status?: string; 
    search?: string; 
    sort?: string 
  }) =>
    api.get(API_ENDPOINTS.ADMIN_APPOINTMENTS.GET_ALL, { params }),
    
  getAppointmentDetails: (id: string) =>
    api.get(API_ENDPOINTS.ADMIN_APPOINTMENTS.GET_DETAILS(id)),
};
