import { Route, Routes } from "react-router-dom";

import { PublicRoutes } from "./publicRoutes";
import { AdminRoutes } from "./adminRoutes";
import { PatientRoutes } from "./patientRoutes";
import { DoctorRoutes } from "./doctorRoutes";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      {AdminRoutes()}
      {PatientRoutes()}
      {DoctorRoutes()}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
