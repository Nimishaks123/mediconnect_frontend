import {api} from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
//Get verified doctors
export const getVerifiedDoctors=(params:any)=>{
    return api.get(API_ENDPOINTS.DOCTORS.VERIFIED,{params})
   
};
//Get doctordetails by id
export const getDoctorById=(
    doctorId:string)=>{
        return api.get(API_ENDPOINTS.DOCTORS.GET_BY_ID(doctorId))

    }
    export const getDoctorSpecialties=()=>{
       return api.get(API_ENDPOINTS.DOCTORS.SPECIALTIES)
    }

