import { Link } from "react-router-dom";

export default function WalletTopupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-2xl font-bold mb-2">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-6">
          Your wallet top-up payment was completed successfully.
          Your wallet balance will be updated shortly.
        </p>

        <Link
          to="/patient/wallet"
          className="bg-sky-600 text-white px-6 py-3 rounded-xl"
        >
          Back to Wallet
        </Link>
      </div>
    </div>
  );
}