import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminWalletApi } from "../api/adminWalletApi";
import { toast } from "react-hot-toast";
import { 
  WalletIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from "@heroicons/react/24/outline";

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NEWEST");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await adminWalletApi.getWallets({ 
        page, 
        limit: 10, 
        search: search || undefined,
        sort 
      });
      setWallets(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      toast.error("Failed to fetch wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchWallets, 300);
    return () => clearTimeout(timer);
  }, [page, search, sort]);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">WALLETS</h1>
            <p className="text-gray-500 font-medium mt-1">Monitor user balances and financial flows</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search user or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm w-64 shadow-sm"
              />
            </div>
            
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none font-bold text-xs text-gray-600 uppercase tracking-widest appearance-none cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
            >
              <option value="NEWEST">Newest First</option>
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
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Wallet Balance</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Credits</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Debits</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Activity</th>
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
              ) : wallets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                        <WalletIcon className="w-10 h-10" />
                      </div>
                      <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No wallets found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                wallets.map((w) => (
                  <tr key={w.userId} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                          {w.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 text-sm tracking-tight">{w.name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{w.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-lg font-black text-gray-900 tracking-tighter">₹{w.balance.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <ArrowTrendingUpIcon className="w-4 h-4" />
                        ₹{w.totalCredits.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                        <ArrowTrendingDownIcon className="w-4 h-4" />
                        ₹{w.totalDebits.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        to={`/admin/wallets/${w.userId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest group-hover:shadow-lg"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View History
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-8 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:bg-blue-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
