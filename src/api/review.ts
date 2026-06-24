import { api } from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const createReview = async (
  appointmentId: string,
  rating: number,
  comment: string
) => {
  const res = await api.post(
    API_ENDPOINTS.REVIEWS.CREATE,
    {
      appointmentId,
      rating,
      comment,
    }
  );

  return res.data;
};

export const getDoctorReviews = async (
  doctorId: string
) => {
  const res = await api.get(
    API_ENDPOINTS.REVIEWS.GET_DOCTOR_REVIEWS(
      doctorId
    )
  );

  return res.data.data;
};