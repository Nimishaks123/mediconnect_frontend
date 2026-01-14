import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchPendingDoctors,
  approveDoctor,
  rejectDoctor,
} from "../store/admin/pendingDoctorsSlice";
import toast from "react-hot-toast";

export default function PendingDoctorsPage() {
  const dispatch = useAppDispatch();
  const { doctors, loading } = useAppSelector((state) => state.pendingDoctors);

  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null }>({
    open: false,
    id: null,
  });
  const [reason, setReason] = useState("");

  useEffect(() => {
    dispatch(fetchPendingDoctors());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;

  if (!doctors.length)
    return <p className="text-center mt-10 text-gray-600">No pending doctors 🎉</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Pending Doctors</h1>

      <div className="space-y-4">
        {doctors.map((item) => (
          <div key={item.doctor.id} className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={item.doctor.profilePhoto ?? "/default-doctor.png"}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{item.user.name}</p>
                <p className="text-gray-600">{item.user.email}</p>
                <p className="text-gray-500 text-sm">{item.doctor.specialty}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  dispatch(approveDoctor(item.doctor.userId));
                  toast.success("Doctor approved");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Approve
              </button>

              <button
                onClick={() => setRejectModal({ open: true, id: item.doctor.userId })}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold">Reject Doctor</h2>

            <textarea
              className="w-full border p-2 rounded"
              placeholder="Reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setRejectModal({ open: false, id: null })}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => {
                  dispatch(rejectDoctor({ userId: rejectModal.id!, reason }));
                  toast.success("Doctor rejected");
                  setRejectModal({ open: false, id: null });
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
