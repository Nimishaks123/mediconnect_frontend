
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectCurrentUser,logout } from "../../../store/auth/authSlice";
import { selectDoctorProfile } from "../../../store/doctor/doctorSelectors";

export default function Topbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectCurrentUser);
  const doctorProfile = useAppSelector(selectDoctorProfile);

  const [open, setOpen] = useState(false);
    useEffect(() => {
    setOpen(false);
  }, [navigate]);

  if (!user) return null;

  const displayName =
    user.name || user.email.split("@")[0];

  const profileImage = doctorProfile?.photo ?? null;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdown on navigation


  return (
    <div className="flex items-center justify-between mb-8">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search"
        className="w-1/3 px-4 py-2 rounded-lg bg-gray-100 outline-none focus:ring-2 focus:ring-mediconnect-green"
      />

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">
        {/* NOTIFICATIONS (placeholder) */}
        <button
          className="text-gray-600 hover:text-gray-800 text-lg"
          aria-label="Notifications"
        >
          🔔
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            {/* PROFILE IMAGE */}
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover border border-gray-300 ring-2 ring-mediconnect-green/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-mediconnect-green text-white flex items-center justify-center font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}

            {/* NAME */}
            <span className="font-medium text-gray-800">
              {displayName}
            </span>
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-44 rounded-xl border border-gray-100 bg-white shadow-lg py-2 text-sm z-50">
              <button
                onClick={() => navigate("/doctor/profile")}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
