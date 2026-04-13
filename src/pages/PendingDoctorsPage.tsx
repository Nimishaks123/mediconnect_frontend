import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAdminDoctors,
  approveDoctor,
  rejectDoctor,
} from "../store/admin/pendingDoctorsSlice";
import toast from "react-hot-toast";
import { 
  MagnifyingGlassIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ClockIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function PendingDoctorsPage() {
  const dispatch = useAppDispatch();
  const { doctors, loading, pagination } = useAppSelector((state) => state.pendingDoctors);

  const [status, setStatus] = useState<VerificationStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NEWEST");
  const [page, setPage] = useState(1);

  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [reason, setReason] = useState("");

  const fetchData = () => {
    dispatch(fetchAdminDoctors({ 
      status,
      page, 
      limit: 8, 
      search: search || undefined, 
      sort 
    }));
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [status, page, search, sort]);

  const handleApprove = async (userId: string) => {
    try {
      await dispatch(approveDoctor(userId)).unwrap();
      toast.success("Doctor approved successfully");
      fetchData(); 
    } catch (err: any) {
      toast.error(err || "Failed to approve doctor");
    }
  };

  const handleReject = async () => {
    try {
      if (!reason.trim()) return toast.error("Please provide a reason");
      await dispatch(rejectDoctor({ userId: rejectModal.id!, reason })).unwrap();
      toast.success("Doctor application rejected");
      setRejectModal({ open: false, id: null });
      setReason("");
      fetchData();
    } catch (err: any) {
      toast.error(err || "Failed to reject doctor");
    }
  };

  const tabConfigs = [
    { id: "PENDING", label: "Pending", icon: ClockIcon, color: "blue" },
    { id: "APPROVED", label: "Approved", icon: CheckCircleIcon, color: "emerald" },
    { id: "REJECTED", label: "Rejected", icon: XCircleIcon, color: "rose" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              DOCTOR <span className="text-blue-600">VERIFICATION</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-[0.2em]">Review and manage medical professionals</p>
          </div>
          
          <div className="flex h-fit items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name, email or reg #..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-12 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm w-64 md:w-72"
              />
            </div>
            
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:outline-none font-bold text-xs text-gray-600 uppercase tracking-widest cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 bg-white/50 p-2 rounded-[2rem] border border-gray-100 w-fit backdrop-blur-md">
          {tabConfigs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setStatus(tab.id as VerificationStatus); setPage(1); }}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                status === tab.id 
                  ? "bg-white text-gray-900 shadow-xl shadow-gray-200/50" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/40"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${status === tab.id ? `text-${tab.color}-600` : ""}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-gray-100 animate-pulse" />
          ))
        ) : doctors.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-200">
                <IdentificationIcon className="w-10 h-10" />
              </div>
              <div>
                <p className="text-gray-900 font-black uppercase tracking-widest text-sm">No {status.toLowerCase()} applications</p>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Refine your search or check another tab</p>
              </div>
            </div>
          </div>
        ) : (
          doctors.map((item) => (
            <div key={item.doctor.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 hover:border-blue-200 transition-all group flex flex-col lg:flex-row items-center justify-between gap-8 animate-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col md:flex-row items-center gap-8 flex-grow">
                <div className="relative">
                  <img
                    src={item.doctor.profilePhoto ?? "/default-doctor.png"}
                    alt={item.user.name}
                    className="w-24 h-24 rounded-3xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png")}
                  />
                  <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-xl shadow-lg border-2 border-white ${
                    status === "APPROVED" ? "bg-emerald-600 text-white" : 
                    status === "REJECTED" ? "bg-rose-600 text-white" : "bg-blue-600 text-white"
                  }`}>
                    {status === "APPROVED" ? <CheckCircleIcon className="w-4 h-4" /> : 
                     status === "REJECTED" ? <XCircleIcon className="w-4 h-4" /> : <ClockIcon className="w-4 h-4" />}
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start space-y-3">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{item.user.name}</h3>
                    <p className="text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 mt-1">
                       <IdentificationIcon className="w-4 h-4" /> {item.doctor.specialty}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-500">{item.user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                      <IdentificationIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-black text-gray-400 uppercase">Reg: {item.doctor.registrationNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                      <AcademicCapIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[10px] font-black text-gray-400 uppercase">{item.doctor.experience}Y EXP</span>
                    </div>
                  </div>

                  {status === "APPROVED" && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                      <CalendarIcon className="w-4 h-4" />
                      <span className="text-[11px] font-black uppercase tracking-wider">
                        Verified on {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(item.doctor.verifiedAt!))}
                      </span>
                    </div>
                  )}

                  {status === "REJECTED" && (
                    <div className="flex flex-col gap-1 w-full max-w-md">
                      <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span className="text-[11px] font-black uppercase tracking-wider">Rejection Reason</span>
                      </div>
                      <p className="text-[11px] font-medium text-gray-500 px-4 mt-1 bg-gray-50/50 py-2 rounded-xl border border-gray-50 border-dashed italic">
                        "{item.doctor.rejectionReason || "No reason specified"}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {status === "PENDING" && (
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => handleApprove(item.doctor.userId)}
                    className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-95"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Approve
                  </button>

                  <button
                    onClick={() => setRejectModal({ open: true, id: item.doctor.userId })}
                    className="flex-grow lg:flex-grow-0 flex items-center justify-center gap-2 px-6 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-rose-100 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-100 transition-all active:scale-95"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!loading && doctors.length > 0 && (
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
            Reviewing <span className="text-gray-900 font-black">{doctors.length}</span> of <span className="text-gray-900 font-black">{pagination.total}</span> Records
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <span className="px-4 py-2 font-black text-xs text-gray-400">PAGE {page} / {pagination.totalPages}</span>

            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {rejectModal.open && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-4">
                 <XCircleIcon className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Reject Application</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Provide a detailed reason for the rejection</p>
            </div>

            <textarea
              className="w-full bg-gray-50 border-none rounded-3xl p-6 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-sm min-h-[120px]"
              placeholder="E.g. Profile photo is blurry, license expired..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <button
                className="px-6 py-4 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                onClick={() => { setRejectModal({ open: false, id: null }); setReason(""); }}
              >
                Cancel
              </button>

              <button
                className="px-6 py-4 bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                onClick={handleReject}
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
