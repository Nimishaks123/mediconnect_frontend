import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { useAppDispatch } from "../store/hooks";
import { fetchDoctorProfile } from "../store/doctor/doctorSlice";

import Sidebar from "../components/doctor/dashboard/Sidebar";
import Topbar from "../components/doctor/dashboard/Topbar";

import { useBlockListener } from "../hooks/useBlockListener";

export default function DoctorLayout() {
  useBlockListener();

  const dispatch = useAppDispatch();
  const location = useLocation();

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      dispatch(fetchDoctorProfile());
      isInitialMount.current = false;
    }
  }, [dispatch]);

  const hideSearch =
    location.pathname.startsWith("/doctor/schedule") ||
    location.pathname.startsWith("/doctor/slots") ||
    location.pathname.startsWith("/doctor/profile");

  return (
    <div className="flex h-screen bg-gray-50">

      {/* Sidebar */}

      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Sticky Topbar */}

        <div className="sticky top-0 z-40 bg-gray-50 px-6 pt-6">
          <Topbar hideSearch={hideSearch} />
        </div>

        {/* Page Content */}

        <main className="flex-1 overflow-y-auto px-6 pb-6">

          <div className="mx-auto w-full max-w-7xl">

            <Outlet />

          </div>

        </main>

      </div>

    </div>
  );
}