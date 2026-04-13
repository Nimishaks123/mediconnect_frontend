import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/doctor/dashboard/Sidebar";
import Topbar from "../components/doctor/dashboard/Topbar";

export default function DoctorLayout() {
  const location = useLocation();

  const hideSearch =
    location.pathname.startsWith("/doctor/schedule") ||
    location.pathname.startsWith("/doctor/slots") ||
    location.pathname.startsWith("/doctor/profile");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT CONTENT */}
      <main className="flex-1 p-8">
        <Topbar hideSearch={hideSearch} />
        <Outlet />
      </main>
    </div>
  );
}
