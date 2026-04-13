import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader } from "../components/admin/AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Dynamic content */}
        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
