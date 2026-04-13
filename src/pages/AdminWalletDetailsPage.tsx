import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminWalletApi } from "../api/adminWalletApi";
import { toast } from "react-hot-toast";
import { 
  ArrowLeftIcon,
  UserIcon,
  CreditCardIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

export default function AdminWalletDetailsPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NEWEST");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await adminWalletApi.getTransactions(userId, { 
        page, 
        limit: 10, 
        type: type || undefined,
        search: search || undefined,
        sort
      });
      setData(res.data);
      setTransactions(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error("Failed to fetch transactions");
      navigate("/admin/wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(timer);
  }, [userId, page, type, search, sort]);

  if (!data && loading) return <div className="p-8 text-center font-black animate-pulse text-gray-400">LOADING FINANCIAL RECORDS...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        BACK TO WALLETS
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 p-8">
             <div className="flex flex-col items-center text-center space-y-4">
               <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-200">
                 {data?.userName.charAt(0)}
               </div>
               <div>
                 <h2 className="text-xl font-black text-gray-900 leading-tight">{data?.userName}</h2>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{data?.userEmail}</p>
               </div>
               <div className="pt-4 border-t border-gray-50 w-full">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Balance</p>
                 <p className="text-3xl font-black text-blue-600 tracking-tighter">₹{data?.balance.toLocaleString()}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <CreditCardIcon className="w-5 h-5 text-blue-600" /> Transaction Audit
              </h3>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-grow">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="pl-12 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-xs w-full shadow-sm"
                  />
                </div>

                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none font-bold text-[10px] text-gray-600 uppercase tracking-widest appearance-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <option value="NEWEST">Newest</option>
                  <option value="OLDEST">Oldest</option>
                </select>
                
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                  {["", "CREDIT", "DEBIT"].map(t => (
                    <button
                      key={t}
                      onClick={() => { setType(t); setPage(1); }}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        type === t 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {t || "ALL"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white border-b border-gray-50">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8"><div className="h-4 bg-gray-50 rounded-full w-full"></div></td>
                      </tr>
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No records found</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                            <ClockIcon className="w-3 h-3" />
                            {new Date(tx.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                            tx.type === "CREDIT" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-500 border-rose-100"
                          }`}>
                            {tx.type === "CREDIT" ? <ArrowUpCircleIcon className="w-3 h-3 mr-1" /> : <ArrowDownCircleIcon className="w-3 h-3 mr-1" />}
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-xs font-bold text-gray-900">{tx.description}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`text-sm font-black ${tx.type === "CREDIT" ? "text-emerald-600" : "text-rose-500"}`}>
                            {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
