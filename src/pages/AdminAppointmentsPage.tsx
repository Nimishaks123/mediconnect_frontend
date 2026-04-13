import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminAppointmentApi } from "../api/adminAppointmentApi";
import { toast } from "react-hot-toast";
import { 
  CalendarIcon, 
  ClockIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

type AppointmentType = "UPCOMING" | "PAST" | "RECENT";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [type, setType] = useState<AppointmentType>("UPCOMING");
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"LATEST" | "OLDEST">("LATEST");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await adminAppointmentApi.getAppointments({ 
        page, 
        limit: 8, 
        type,
        status: status || undefined,
        search: search || undefined,
        sort
      });
      setAppointments(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAppointments();
    }, 300); // Simple debounce for search
    return () => clearTimeout(timer);
  }, [page, type, status, search, sort]);

  const handleTabChange = (newType: AppointmentType) => {
    setType(newType);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "CANCELLED": return "bg-rose-50 text-rose-700 border-rose-100";
      case "PENDING": return "bg-amber-50 text-amber-700 border-amber-100";
      case "COMPLETED": return "bg-blue-50 text-blue-700 border-blue-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">APPOINTMENTS</h1>
            <p className="text-gray-500 font-medium mt-1">Monitor and manage all system consultations</p>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200">
            {(["UPCOMING", "PAST", "RECENT"] as AppointmentType[]).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                  type === t 
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          {/* Search */}
          <div className="lg:col-span-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
            />
          </div>

          {/* Status Chips */}
          <div className="lg:col-span-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {["", "CONFIRMED", "PENDING", "CANCELLED"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  status === s 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100" 
                    : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"
                }`}
              >
                {s || "ALL STATUS"}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="lg:col-span-1 flex justify-end">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value as any); setPage(1); }}
              className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-bold text-xs text-gray-600 uppercase tracking-widest appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="LATEST">Latest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Consultation ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Participants</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Schedule</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Lifecycle</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-10">
                      <div className="h-4 bg-gray-100 rounded-full w-3/4 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                        <CalendarIcon className="w-10 h-10 text-gray-200" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-900 font-black uppercase tracking-widest text-sm">No Results Found</p>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Adjust your filters or search query</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.appointmentId} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{apt.appointmentId.slice(-8)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-black text-xs uppercase" title={`Patient: ${apt.patientName}`}>
                            {apt.patientName.charAt(0)}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-white font-black text-xs uppercase" title={`Doctor: ${apt.doctorName}`}>
                            D
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 text-sm uppercase tracking-tight">{apt.patientName}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">w/ Dr. {apt.doctorName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-gray-900 tracking-tight">{apt.date}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          <ClockIcon className="w-3 h-3 text-blue-500" />
                          {apt.startTime} - {apt.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        to={`/admin/appointments/${apt.appointmentId}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-blue-200/50"
                      >
                        <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gray-50/30">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
            Showing <span className="text-gray-900">{appointments.length}</span> Results · Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 transition-all font-bold shadow-sm"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-11 h-11 rounded-2xl text-xs font-black transition-all ${
                      page === pageNum 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "text-gray-400 hover:bg-white hover:text-blue-600 border border-transparent hover:border-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="px-2 text-gray-300">...</span>}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-2xl border border-gray-200 bg-white text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-400 transition-all font-bold shadow-sm"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

