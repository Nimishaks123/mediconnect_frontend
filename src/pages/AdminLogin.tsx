// pages/AdminLogin.tsx
import Header from "../components/layout/Header";
import AdminLoginForm from "../components/admin/AdminLoginForm";

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 bg-gray-100">
        <AdminLoginForm />
      </main>
    </div>
  );
}



