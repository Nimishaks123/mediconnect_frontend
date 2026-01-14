// src/components/doctor/Sidebar.tsx
import SignupImage from "../../../assets/image 16.png"
export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-sky-700 to-sky-800 text-white shadow-xl p-6">
  {/* BRAND */}
  <div className="flex items-center gap-3 mb-12">
    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
      <img
        src={SignupImage}
        alt="MediConnect"
        className="w-8 h-8 object-contain"
      />
    </div>

    <div className="flex flex-col">
      <span className="text-xl font-bold tracking-wide">
        MediConnect
      </span>
      <span className="text-xs text-white/70">
        Doctor Dashboard
      </span>
    </div>
  </div>
      <nav className="space-y-4 text-lg">
        <p className="font-semibold">Dashboard</p>
        <p className="opacity-80">Appointments</p>
        <p className="opacity-80">Patients</p>
        <p className="opacity-80">Video Call</p>
        <p className="opacity-80">Messages</p>
        <p className="opacity-80">Wallet</p>
        <p className="opacity-80">Profile</p>
      </nav>
    </aside>
  );
}
