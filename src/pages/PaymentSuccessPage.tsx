import { useParams, useNavigate } from "react-router-dom";

export default function PaymentSuccessPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow max-w-md text-center">
        <h1 className="text-2xl font-semibold text-green-600 mb-3">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-4">
          Your appointment has been confirmed.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Appointment ID:
          <br />
          <span className="font-mono break-all">
            {appointmentId}
          </span>
        </p>

        <button
          onClick={() => navigate("/patient/appointments")}
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
        >
          View My Appointments
        </button>
      </div>
    </div>
  );
}
