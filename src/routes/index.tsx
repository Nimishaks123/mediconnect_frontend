import { Route, Routes } from "react-router-dom";

import { PublicRoutes } from "./publicRoutes";
import { AdminRoutes } from "./adminRoutes";
import { PatientRoutes } from "./patientRoutes";
import { DoctorRoutes } from "./doctorRoutes";
import NotFoundPage from "../pages/NotFoundPage";

import ChatPage from "../pages/chat/ChatPage";
import VideoCallPage from "../pages/chat/VideoCallPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { ROLES } from "../constants/roles";

export default function AppRoutes() {
  return (
    <Routes>
      {PublicRoutes()}
      {AdminRoutes()}
      {PatientRoutes()}
      {DoctorRoutes()}
      
      {/* Shared Chat & Call Routes */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.PATIENT, ROLES.DOCTOR]} />}>
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/call/:appointmentId" element={<VideoCallPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
