import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-6xl px-6 py-10 space-y-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
