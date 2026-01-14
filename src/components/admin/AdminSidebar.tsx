
// const sidebarItems = [
//   "Dashboard",
//   "Doctors",
//   "Patients",
//   "Wallet",
//   "Report",
//   "Profile",
//   "Complaints",
// ];

// export const AdminSidebar = () => {
//   return (
//     <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-200 px-6 py-8">
//       <div className="mb-10">
//         <p className="text-2xl font-bold text-mediconnect-green">MediConnect</p>
//       </div>

//       <nav className="space-y-2">
//         {sidebarItems.map((label, index) => (
//           <button
//             key={label}
//             className={`w-full text-left rounded-xl px-4 py-3 font-medium transition ${
//               index === 0
//                 ? "bg-mediconnect-green text-white shadow"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </nav>
//     </aside>
//   );
// };
import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiClipboardList,
  HiUserGroup,
  HiBan,
} from "react-icons/hi";

export const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
      <div className="p-6 text-2xl font-bold text-blue-600 border-b">
        MediConnect Admin
      </div>

      <nav className="mt-6 space-y-2 px-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md ${
              isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
            }`
          }
        >
          <HiHome />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/doctors/pending"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md ${
              isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
            }`
          }
        >
          <HiClipboardList />
          Pending Doctors
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md ${
              isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
            }`
          }
        >
          <HiUserGroup />
          Users
        </NavLink>

        <NavLink
          to="/admin/blocked-users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-md ${
              isActive ? "bg-blue-100 text-blue-600" : "text-gray-700"
            }`
          }
        >
          <HiBan />
          Blocked Users
        </NavLink>
      </nav>
    </aside>
  );
};
