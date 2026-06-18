import { useParams } from "react-router-dom";
import { useState } from "react";
import { createPrescription } from "../../api/prescription";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function CreatePrescriptionPage() {
  const { appointmentId } = useParams();

  const [diagnosis, setDiagnosis] = useState("");

  const [notes, setNotes] = useState("");

  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);
  const addMedicine = () => {
  setMedicines([
    ...medicines,
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);
};
const navigate = useNavigate();
const location=useLocation();
const appointment=location.state?.appointment;


const handleSubmit = async () => {
      if (!appointmentId) {
    toast.error("Appointment ID missing");
    return;
  }

  try {
    await createPrescription({
      appointmentId,
      diagnosis,
      medicines,
      notes,
    });

    toast.success(
      "Prescription created successfully"
    );

    navigate(
      "/doctor/appointments"
    );

  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to create prescription"
    );
  }
};

const updateMedicine = (
  index: number,
  field: string,
  value: string
) => {
  const updated = [...medicines];

  updated[index] = {
    ...updated[index],
    [field]: value,
  };

  setMedicines(updated);
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Create Prescription
      </h1>

     <p className="text-gray-500 mb-6">
  Booking ID: #{appointment?.bookingId}
</p>

      {/* Diagnosis */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Diagnosis
        </label>

        <textarea
          value={diagnosis}
          onChange={(e) =>
            setDiagnosis(e.target.value)
          }
          className="w-full border rounded-lg p-3"
          rows={4}
        />
        <div className="space-y-4">
  <h2 className="font-semibold text-lg">
    Medicines
  </h2>

  {medicines.map((med, index) => (
    <div
      key={index}
      className="border rounded-xl p-4"
    >
      <input
        placeholder="Medicine Name"
        value={med.medicineName}
        onChange={(e) =>
          updateMedicine(
            index,
            "medicineName",
            e.target.value
          )
        }
        className="w-full border p-2 rounded mb-2"
      />

      <input
        placeholder="Dosage"
        value={med.dosage}
        onChange={(e) =>
          updateMedicine(
            index,
            "dosage",
            e.target.value
          )
        }
        className="w-full border p-2 rounded mb-2"
      />

      <input
        placeholder="Frequency"
        value={med.frequency}
        onChange={(e) =>
          updateMedicine(
            index,
            "frequency",
            e.target.value
          )
        }
        className="w-full border p-2 rounded mb-2"
      />

      <input
        placeholder="Duration"
        value={med.duration}
        onChange={(e) =>
          updateMedicine(
            index,
            "duration",
            e.target.value
          )
        }
        className="w-full border p-2 rounded mb-2"
      />

      <input
        placeholder="Instructions"
        value={med.instructions}
        onChange={(e) =>
          updateMedicine(
            index,
            "instructions",
            e.target.value
          )
        }
        className="w-full border p-2 rounded"
      />
    </div>
  ))}

  <button
    onClick={addMedicine}
    className="bg-sky-600 text-white px-4 py-2 rounded-lg"
  >
    + Add Medicine
  </button>
</div>
      </div>

      {/* Notes */}
      <div className="mb-4">
        <label className="block font-medium mb-2">
          Notes
        </label>


        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="w-full border rounded-lg p-3"
          rows={3}
        />
        <div className="mt-6">
  <button
    onClick={handleSubmit}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
  >
    Save Prescription
  </button>
</div>
      </div>
    </div>
  );
}