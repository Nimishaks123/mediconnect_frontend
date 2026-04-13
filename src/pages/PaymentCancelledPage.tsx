import { useNavigate } from "react-router-dom";

export default function PaymentCancelledPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-md text-center">
        <h1 className="text-2xl font-semibold text-red-600 mb-3">
          Payment Cancelled ❌
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was not completed.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
