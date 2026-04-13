import React, { useState, useEffect } from "react";
import SignupImage from "../../assets/image 16.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectCurrentUser, logout } from "../../store/auth/authSlice";

import { ROUTES } from "../../constants/routes";
import NotificationBell from "../NotificationBell";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = Boolean(user);

  const [menuOpen, setMenuOpen] = useState(false);

  // -----------------------------
  // DYNAMIC HOME ROUTE
  // -----------------------------
  let homeRoute: string = ROUTES.HOME;

  if (user?.role === "PATIENT") {
    homeRoute = ROUTES.USER_DASHBOARD;
  } else if (user?.role === "DOCTOR") {
    homeRoute = ROUTES.DOCTOR_DASHBOARD;
  } else if (user?.role === "ADMIN") {
    homeRoute = ROUTES.ADMIN_DASHBOARD;
  }

  const navLinks = [
    { label: "Home", to: homeRoute },
    { label: "Services", to: "/services" },
    { label: "Contact Us", to: "/contact" },
    { label: "About Us", to: "/about" },
  ];

  // -----------------------------
  // ROUTE DETECTION
  // -----------------------------
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <div
          onClick={() => navigate(homeRoute)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={SignupImage} className="w-9 h-9" alt="MediConnect" />
          <span className="text-xl font-bold text-mediconnect-green">
            MediConnect
          </span>
        </div>

        {/* NAV LINKS */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"} // Fix for active link highlighting on root
              className={({ isActive }) =>
                isActive
                  ? "text-mediconnect-green font-semibold"
                  : "text-gray-700 hover:text-mediconnect-green"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-4">
          {/* =========================
              LOGIN / SIGNUP (PUBLIC)
             ========================= */}
          {!isAdminRoute && !isAuthPage && !isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 font-medium hover:text-mediconnect-green"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700"
              >
                Signup
              </button>
            </>
          )}

          {/* =========================
              USER DROPDOWN
             ========================= */}
          {!isAdminRoute && isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5"
                >
                  <div className="h-8 w-8 rounded-full bg-mediconnect-green text-white flex items-center justify-center">
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold">
                    {user.name || user.email}
                  </span>
                </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg py-2 text-sm">
                  <button
                    onClick={() => {
                      if (user.role === "PATIENT") {
                        navigate(ROUTES.PATIENT_PROFILE);
                      } else if (user.role === "DOCTOR") {
                        navigate(ROUTES.DOCTOR_PROFILE);
                      } else {
                        navigate("/profile");
                      }
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  {user.role === "PATIENT" && (
                     <>
                      <button
                          onClick={() => navigate(ROUTES.PATIENT_APPOINTMENTS)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                          My Appointments
                      </button>
                      <button
                          onClick={() => navigate(ROUTES.PATIENT_WALLET)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      >
                          My Wallet
                      </button>
                     </>
                  )}
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
