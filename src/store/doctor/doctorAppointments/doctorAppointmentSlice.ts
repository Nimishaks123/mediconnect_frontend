import { createSlice } from "@reduxjs/toolkit";

//import type { Appointment } from "../../../types/Appointment";
import type {
  DoctorAppointment,
} from "../../../types/DoctorAppointment";

import { fetchDoctorAppointments } from "./doctorAppointmentThunks";
interface DoctorAppointmentState {

  upcoming: DoctorAppointment[];

  recent: DoctorAppointment[];

  past: DoctorAppointment[];

  loading:boolean;

  error:string | null;
}

const initialState :DoctorAppointmentState= {

  upcoming: [],

  recent: [],

  past: [],

  loading:false,

  error:null

}


const doctorAppointmentSlice = createSlice({
  name: "doctorAppointments",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        fetchDoctorAppointments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
  fetchDoctorAppointments.fulfilled,
  (state, action) => {
    console.log("Redux Payload:", action.payload);

    state.loading = false;
    state.error = null;

    state.upcoming = action.payload.upcoming;
    state.recent = action.payload.recent;
    state.past = action.payload.past;
  }
)

      .addCase(
        fetchDoctorAppointments.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ?? "Something went wrong";
        }
      );
  },
});

export default doctorAppointmentSlice.reducer;