// import { NavLink } from "react-router-dom";
// import {
//   HiHome,
//   HiClipboardList,
//   HiUserGroup,
//   HiCalendar,
//   HiCreditCard,
//   HiCog
// } from "react-icons/hi";
// import { ROUTES } from "../../constants/routes";
// export const AdminSidebar = () => {
//   return (
//     <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
//       <div className="p-6 text-2xl font-bold text-blue-600 border-b">
//         MediConnect Admin
//       </div>

//       <nav className="mt-6 space-y-2 px-4">
//         <NavLink
//           to="/admin/dashboard"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-md ${
//               isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
//             }`
//           }
//         >
//           <HiHome />
//           Dashboard
//         </NavLink>

//         <NavLink
//           to="/admin/doctors/pending"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-md ${
//               isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
//             }`
//           }
//         >
//           <HiClipboardList />
//           Pending Doctors
//         </NavLink>

//         <NavLink
//           to="/admin/appointments"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-md ${
//               isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
//             }`
//           }
//         >
//           <HiCalendar />
//           Appointments
//         </NavLink>

//         <NavLink
//           to="/admin/wallets"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-md ${
//               isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
//             }`
//           }
//         >
//           <HiCreditCard />
//           Wallets
//         </NavLink>
//         <NavLink
//   to={ROUTES.ADMIN_PLATFORM_WALLET}
//   className={({ isActive }) =>
//     `flex items-center gap-3 p-3 rounded-md ${
//       isActive
//         ? "bg-blue-100 text-blue-600"
//         : "text-gray-700"
//     }`
//   }
// >
//   <HiCreditCard />
//   Platform Wallet
// </NavLink>
//         <NavLink
//   to="/admin/settings"
//   className={({ isActive }) =>
//     `flex items-center gap-3 p-3 rounded-md ${
//       isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
//     }`
//   }
// >
//   <HiCog />
//   Settings
// </NavLink>

//         <NavLink
//           to="/admin/users"
//           className={({ isActive }) =>
//             `flex items-center gap-3 p-3 rounded-md ${
//               isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
//             }`
//           }
//         >
//           <HiUserGroup />
//           Users
//         </NavLink>
//       </nav>
//     </aside>
//   );
// };
import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiClipboardList,
  HiUserGroup,
  HiCalendar,
  HiCreditCard,
  HiCog,
} from "react-icons/hi";

import { ROUTES } from "../../constants/routes";

const menuItems = [
  {
    label: "Dashboard",
    path: ROUTES.ADMIN_DASHBOARD,
    icon: HiHome,
  },
  {
    label: "Pending Doctors",
    path: ROUTES.ADMIN_PENDING_DOCTORS,
    icon: HiClipboardList,
  },
  {
    label: "Appointments",
    path: ROUTES.ADMIN_APPOINTMENTS,
    icon: HiCalendar,
  },
  {
    label: "Wallets",
    path: ROUTES.ADMIN_WALLETS,
    icon: HiCreditCard,
  },
  {
    label: "Platform Wallet",
    path: ROUTES.ADMIN_PLATFORM_WALLET,
    icon: HiCreditCard,
  },
  {
    label: "Users",
    path: ROUTES.ADMIN_USERS,
    icon: HiUserGroup,
  },
  {
    label: "Settings",
    path: ROUTES.ADMIN_SETTINGS,
    icon: HiCog,
  },
];

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6 border-b flex flex-col items-start gap-1">
        <span className="text-2xl font-bold text-mediconnect-green">
          MediConnect
        </span>
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Admin Portal
        </span>
      </div>

      <nav className="mt-6 space-y-2 px-4">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Icon className="text-lg" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};