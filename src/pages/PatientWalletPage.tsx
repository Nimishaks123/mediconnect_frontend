import { useEffect, useState } from "react";
import Pagination from "../components/common/Pagination";
import { toast } from "react-hot-toast";
import {
  getMyWallet,
  topupWallet,getWalletTransactions
} from "../api/patientAppointments";

type Transaction = {
  id: string;
  transactionRef: string;
  walletId: string;
  amount: number;
  description: string;
  type: "CREDIT" | "DEBIT";
  source: string;
  status: string;
  stripeSessionId: string | null;
  createdAt: string;
};

type WalletData = {
  balance: number;
  transactions: Transaction[];
};

export default function PatientWalletPage() {
  const [totalPages, setTotalPages] =
  useState(1);
  
  const [showTopupModal, setShowTopupModal] =
  useState(false);

const [amount, setAmount] =
  useState("");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] =
  useState<Transaction[]>([]);

const [, setTotalTransactions] =
  useState(0);

const [page, setPage] =
  useState(1);
  const [loading, setLoading] = useState(true);
  const [topupLoading, setTopupLoading] =
  useState(false);
  const [error, setError] = useState<string | null>(null);
  //const transactions = wallet?.transactions ?? [];
  const handleTopup =
  async () => {

  if (!amount) {
    toast.error("Please enter an amount");
    return;
  }

  if (Number(amount) < 100) {
    toast.error(
      "Minimum topup amount is ₹100"
    );
    return;
  }


    try {

    setTopupLoading(true);

      const response =
        await topupWallet(
          Number(amount)
        );

      window.location.href =
        response.data.checkoutUrl;

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to start payment"
      );
    }
    finally {

    setTopupLoading(false);

  }
  };

  useEffect(() => {

  const loadWalletData = async () => {

    try {

      setLoading(true);

      const walletData =
        await getMyWallet();

      setWallet(walletData);
      

      const txData =
        await getWalletTransactions(
          page,
          3
        );

        console.log(
  "Transactions API:",
  txData
);

      setTransactions(
  txData.transactions
);

setTotalTransactions(
  txData.total
);

setTotalPages(
  txData.totalPages
);

    } catch (err) {

      console.error(
        "Wallet load error:",
        err
      );

      setError(
        "Unable to load wallet data. Please try again later."
      );

      toast.error(
        "Failed to load wallet data"
      );

    } finally {

      setLoading(false);

    }
  };

  loadWalletData();

}, [page]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mb-4"></div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Wallet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">{error}</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm font-medium">We encountered an internal server error while retrieving your financial data.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-sky-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Wallet</h1>
        <p className="mt-2 text-gray-600">Manage your refunds and track transaction history.</p>
      </header>
      <div className="mb-6">

  <button
    onClick={() =>
      setShowTopupModal(true)
    }
    className="
      bg-sky-600
      text-white
      px-5
      py-3
      rounded-xl
      font-semibold
      hover:bg-sky-700
    "
  >
    Add Funds
  </button>

</div>
      {/* BALANCE CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-8 mb-10 shadow-xl shadow-sky-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-20 -mb-20 blur-2xl" />
        
        <div className="relative z-10">
          <p className="text-sky-100 font-bold uppercase tracking-widest text-xs mb-2">Total Balance Available</p>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-5xl font-black">₹{wallet?.balance.toLocaleString() ?? "0"}</span>
            <span className="text-sky-200 text-lg font-medium">INR</span>
          </div>
          
          <div className="mt-8 flex gap-4">
             <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex-1 border border-white/10">
                <p className="text-sky-100 text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">Refund Status</p>
                <p className="text-white font-bold">Automatic</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex-1 border border-white/10">
                <p className="text-sky-100 text-[10px] uppercase font-bold tracking-wider mb-1 opacity-80">Last Updated</p>
   
<p className="text-white font-bold">
  {transactions[0]
    ? new Date(
        transactions[0].createdAt
      ).toLocaleDateString()
    : "Never"}
</p>
             </div>
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div>
        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
          Transaction Statement
          <span className="h-0.5 w-12 bg-sky-600 inline-block" />
        </h2>

        {transactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50 grayscale">💳</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No transactions recorded</h3>
            <p className="text-gray-500 mt-1 max-w-sm mx-auto">Refunds for cancelled appointments will appear here automatically.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {/* {wallet?.transactions.map((tx, idx) => ( */}
              {transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                      tx.type === "CREDIT" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    }`}>
                      {tx.type === "CREDIT" ? "↓" : "↑"}
                    </div>
                  
                    <div>
  <h4 className="font-bold text-gray-900">
    {tx.description}
  </h4>

  <p className="text-xs text-sky-600 font-semibold">
    {tx.transactionRef}
  </p>

  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
    {new Date(tx.createdAt).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    )}
  </p>
</div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-black ${
                      tx.type === "CREDIT" ? "text-green-600" : "text-gray-900"
                    }`}>
                      {tx.type === "CREDIT" ? "+" : "-"} ₹{tx.amount.toLocaleString()}
                    </p>
                
                    <div className="flex flex-col items-end gap-1">

  <span
    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
      tx.type === "CREDIT"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {tx.type}
  </span>

  <span
    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
      tx.status === "SUCCESS"
        ? "bg-blue-100 text-blue-700"
        : tx.status === "PENDING"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {tx.status}
  </span>

</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        )}
      </div>
      
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
      {
  showTopupModal && (

    <div
      className="
      fixed inset-0
      bg-black/40
      flex items-center
      justify-center
      z-50
    "
    >

      <div
        className="
        bg-white
        rounded-3xl
        p-6
        w-full
        max-w-md
      "
      >

        <h2 className="text-2xl font-bold mb-5">
          Add Funds
        </h2>

        <input
          type="number"
          min="100"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          className="
            w-full
            border
            rounded-xl
            p-3
            mb-5
          "
        />

        <div className="flex gap-3">

          <button
            onClick={() =>
             {
  setShowTopupModal(false);
  setAmount("");
}
            }
            className="
              flex-1
              border
              rounded-xl
              py-3
            "
          >
            Cancel
          </button>
          <button
  onClick={handleTopup}
  disabled={topupLoading}
  className="
    flex-1
    bg-sky-600
    text-white
    rounded-xl
    py-3
    disabled:opacity-50
  "
>
  {topupLoading
    ? "Redirecting..."
    : "Continue"}
</button>
        </div>

      </div>

    </div>
  )
}
    </div>
  );
}
