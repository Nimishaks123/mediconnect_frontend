import { useEffect } from "react";
import {
  useParams,
  useLocation,
} from "react-router-dom";
import jsPDF from "jspdf";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchPrescription } from "../../store/prescription/prescriptionThunks";

export default function PrescriptionPage() {
  const { appointmentId } = useParams();
  const location = useLocation();

const isDoctorView =
  location.pathname.startsWith(
    "/doctor/prescription"
  );

  const dispatch = useAppDispatch();

  const {
    prescription,
    loading,
    error,
  } = useAppSelector(
    (state) => state.prescription
  );
  const handleDownload = () => {
      if (!prescription) return;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("MediConnect Prescription", 20, 20);

  doc.setFontSize(12);

  doc.text(
    `Prescription ID: ${prescription.prescriptionId}`,
    20,
    40
  );

  doc.text(
    `Booking ID: ${prescription.bookingId}`,
    20,
    50
  );

  doc.text(
    `Doctor: Dr. ${prescription.doctor.name}`,
    20,
    60
  );
  doc.text(
  `Registration No: KLMC-${prescription.doctor.registrationNumber}`,
  20,
  70
);

  let y = 80;

doc.setFontSize(14);
doc.text("DIAGNOSIS", 20, y);

y += 10;

doc.setFontSize(12);
doc.text(
  prescription.diagnosis,
  20,
  y
);

y += 20;


 doc.setFontSize(14);
doc.text("MEDICATIONS", 20, y);

y += 15;

prescription.medicines.forEach(
  (medicine, index) => {

    doc.setFontSize(12);

    doc.text(
      `${index + 1}. ${medicine.medicineName}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Dosage: ${medicine.dosage}`,
      30,
      y
    );

    y += 8;

    doc.text(
      `Frequency: ${medicine.frequency}`,
      30,
      y
    );

    y += 8;

    doc.text(
      `Duration: ${medicine.duration}`,
      30,
      y
    );

    y += 8;

    if (medicine.instructions) {
      doc.text(
        `Instructions: ${medicine.instructions}`,
        30,
        y
      );

      y += 8;
    }

    y += 8;
  }
);
doc.setFontSize(14);
doc.text("NOTES", 20, y);

y += 10;

doc.setFontSize(12);

doc.text(
  prescription.notes || "No notes",
  20,
  y
);
  doc.save(
    `Prescription-${prescription.bookingId}.pdf`
  );
};

  useEffect(() => {
    console.log(
    "Prescription Page Appointment ID:",
    appointmentId
  );
    if (appointmentId) {
      dispatch(
        fetchPrescription(appointmentId)
      );
    }
  }, [appointmentId, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-lg">
          Loading prescription...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p>No prescription found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow rounded-2xl p-6">

        <div className="border-b pb-4 mb-6">
        <div className="text-center border-b pb-6 mb-6">
  <h1 className="text-3xl font-bold text-sky-700">
    MediConnect
  </h1>

  <p className="text-gray-500">
    Digital Prescription
  </p>
</div>
{!isDoctorView && (
  <div className="flex justify-end mb-4">
    <button
      onClick={handleDownload}
      className="
        bg-sky-600
        hover:bg-sky-700
        text-white
        px-4
        py-2
        rounded-xl
        font-medium
      "
    >
      Download PDF
    </button>
  </div>
)}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

  <div className="bg-slate-50 p-4 rounded-xl">
    <p className="text-sm text-gray-500">
      Prescription ID
    </p>

    <p className="font-semibold">
      {prescription.prescriptionId}
    </p>
  </div>

  <div className="bg-slate-50 p-4 rounded-xl">
    <p className="text-sm text-gray-500">
      Booking ID
    </p>

    <p className="font-semibold">
      {prescription.bookingId}
    </p>
  </div>

</div>

        </div>
<div className="bg-slate-50 rounded-2xl p-5 mb-8 shadow-sm">

  <h2 className="font-semibold text-lg mb-3">
    Doctor Details
  </h2>

  <p>
    <strong>Doctor:</strong>{" "}
    Dr. {prescription.doctor.name}
  </p>

  <p>
    <strong>Specialty:</strong>{" "}
    {prescription.doctor.specialty}
  </p>

  <p>
    <strong>Registration No:</strong>{" "}
     KLMC-{prescription.doctor.registrationNumber}
  </p>

</div>
        {/* Diagnosis */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Diagnosis
          </h2>

          <div className="bg-gray-50 p-4 rounded-xl">
            {prescription.diagnosis}
          </div>
        </div>

        {/* Medicines */}
       <div className="mb-8">
  <h2 className="text-lg font-semibold mb-4">
    Medicines
  </h2>

  <div className="space-y-4">
    {prescription.medicines.map(
      (medicine, index) => (
        <div
          key={index}
          className="
            border-l-4
            border-sky-500
            bg-sky-50
            p-4
            rounded-r-xl
          "
        >
          <h3 className="font-bold text-lg">
            {medicine.medicineName}
          </h3>

          <div className="mt-2 space-y-1 text-gray-700">
            <p>
              <strong>Dosage:</strong>{" "}
              {medicine.dosage}
            </p>

            <p>
              <strong>Frequency:</strong>{" "}
              {medicine.frequency}
            </p>

            <p>
              <strong>Duration:</strong>{" "}
              {medicine.duration}
            </p>

            {medicine.instructions && (
              <p>
                <strong>
                  Instructions:
                </strong>{" "}
                {medicine.instructions}
              </p>
            )}
          </div>
        </div>
      )
    )}
  </div>
</div>

 <div className="bg-amber-50 border rounded-xl p-4">

  <h2 className="font-semibold mb-2">
    Notes
  </h2>

  <p>
    {prescription.notes ||
      "No notes provided"}
  </p>

</div>
<div className="mt-8 pt-6 border-t text-center">

  <p className="text-gray-500 text-sm">
    Generated via MediConnect
  </p>

  <p className="text-gray-400 text-xs mt-2">
    {prescription.createdAt &&
      new Date(
        prescription.createdAt
      ).toLocaleString()}
  </p>

</div>
      </div>
    </div>

  );
}