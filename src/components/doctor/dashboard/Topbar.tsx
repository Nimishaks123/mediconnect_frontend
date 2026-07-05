import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CalendarDays,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectCurrentUser,
  logout,
} from "../../../store/auth/authSlice";
import { selectDoctorProfile } from "../../../store/doctor/doctorSelectors";

import NotificationBell from "../../NotificationBell";

type Props = {
  hideSearch?: boolean;
};

export default function Topbar({
  hideSearch = false,
}: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(selectCurrentUser);
  const doctorProfile =
    useAppSelector(selectDoctorProfile);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [navigate]);

  if (!user) return null;

  const displayName =
    user.name || user.email.split("@")[0];

  const profileImage =
    doctorProfile?.photo ?? null;

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between mb-8">

      {/* Search */}

      {!hideSearch ? (
        <div className="relative w-full max-w-md">

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search appointments, patients..."
            className="
              w-full
              pl-12
              pr-4
              py-3
              rounded-xl
              border
              border-gray-200
              bg-white
              text-sm
              outline-none
              transition
              focus:border-sky-500
              focus:ring-4
              focus:ring-sky-100
            "
          />

        </div>
      ) : (
        <div />
      )}

      {/* Right Section */}

      <div className="flex items-center gap-5 ml-6">

        {/* Date */}

        <div className="hidden lg:flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-sm">

          <CalendarDays className="w-5 h-5 text-sky-600" />

          <span className="text-sm font-medium text-gray-600">
            {today}
          </span>

        </div>

        {/* Notifications */}

        <NotificationBell />

        {/* Profile */}

        <div className="relative">

          <button
            onClick={() =>
              setOpen((prev) => !prev)
            }
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-gray-100
              bg-white
              px-3
              py-2
              shadow-sm
              hover:border-sky-200
              transition
            "
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="
                  w-10
                  h-10
                  rounded-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-sky-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-semibold
                "
              >
                {displayName
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="hidden md:block text-left">

              <p className="font-semibold text-gray-900">
                Dr. {displayName}
              </p>

              <p className="text-xs text-gray-500">
                Doctor
              </p>

            </div>

            <ChevronDown className="w-4 h-4 text-gray-400" />

          </button>

          {/* Dropdown */}

          {open && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-56
                rounded-2xl
                border
                border-gray-100
                bg-white
                shadow-xl
                overflow-hidden
                z-50
              "
            >

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/doctor/profile");
                }}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  hover:bg-gray-50
                  transition
                "
              >
                <User className="w-5 h-5 text-gray-500" />

                <span className="font-medium">
                  My Profile
                </span>

              </button>

              <div className="border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-5
                  py-4
                  text-red-600
                  hover:bg-red-50
                  transition
                "
              >
                <LogOut className="w-5 h-5" />

                <span className="font-medium">
                  Logout
                </span>

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}