import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAppointmentApi } from "../api/adminAppointmentApi";
import { toast } from "react-hot-toast";
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  BeakerIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/outline";
import { getPrescription } from "../api/prescription";

export default function AdminAppointmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  const [prescription, setPrescription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await adminAppointmentApi.getAppointmentDetails(id);
        setAppointment(res.data);
        
        try {
          const pRes = await getPrescription(id);
          if (pRes && pRes.data) {
             setPrescription(pRes.data);
          }
        } catch (err) {
          // No prescription found, ignore and let empty state render
        }
      } catch (err) {
        toast.error("Failed to fetch appointment details");
        navigate("/admin/appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center animate-pulse font-black text-gray-400 uppercase tracking-widest">Loading details...</div>;
  if (!appointment) return null;

  const isCancelled = appointment.status === "CANCELLED";

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-blue-600 font-bold mb-8 transition-colors group"
      >
        <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
        BACK TO LISTING
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Summary */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 space-y-8">
            <div className="flex justify-between items-start border-b border-gray-100 pb-8">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Appointment ID: {id}</span>
                <h2 className="text-4xl font-black text-gray-900 leading-tight">Consultation Details</h2>
              </div>
              <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                isCancelled ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}>
                {appointment.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <CalendarIcon className="w-6 h-6" />
                  <span className="font-black uppercase tracking-widest text-xs">Date</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{appointment.date}</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <ClockIcon className="w-6 h-6" />
                  <span className="font-black uppercase tracking-widest text-xs">Time Slot</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{appointment.startTime} - {appointment.endTime}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-6">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Service Verification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-3xl">
                  {appointment.paymentStatus === "COMPLETED" ? <CheckCircleIcon className="w-6 h-6 text-emerald-500" /> : <XCircleIcon className="w-6 h-6 text-amber-500" />}
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</p>
                    <p className="font-bold text-gray-900">{appointment.paymentStatus}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-3xl">
                  <VideoCameraIcon className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tele-Health</p>
                    <p className="font-bold text-gray-900">{appointment.status === "COMPLETED" ? "CONSULTED" : "SCHEDULED"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: People */}
        <div className="space-y-8">
          {/* Patient Card */}
          <div className="bg-white rounded-[2rem] shadow-lg border border-gray-100 p-8 space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <UserIcon className="w-4 h-4" /> Patient
            </h3>
            <div className="space-y-1">
              <p className="text-xl font-black text-gray-900">{appointment.patient.name}</p>
              <p className="text-xs font-bold text-gray-500">{appointment.patient.email}</p>
              <p className="text-xs font-bold text-gray-500">{appointment.patient.phone}</p>
            </div>
          </div>

          {/* Doctor Card */}
          <div className="bg-blue-600 rounded-[2rem] shadow-lg shadow-blue-100 p-8 space-y-6 text-white">
            <h3 className="text-xs font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
               Medical Specialist
            </h3>
            <div className="space-y-1">
              <p className="text-xl font-black uppercase">Dr. {appointment.doctor.name}</p>
              <p className="text-sm font-bold text-blue-100">{appointment.doctor.specialty}</p>
              <p className="text-xs font-bold text-blue-200 mt-2">{appointment.doctor.email}</p>
            </div>
          </div>

          {/* Fee Summary */}
          <div className="bg-gray-900 rounded-[2rem] shadow-lg p-8 space-y-4 text-white">
            <div className="flex justify-between items-center text-xs font-black text-white/40 uppercase tracking-[0.2em]">
              <span>Consultation Fee</span>
              <CurrencyDollarIcon className="w-4 h-4" />
            </div>
            <p className="text-3xl font-black">₹{appointment.price}</p>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">All prices in platform currency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Section */}
      <div className="mt-12 space-y-6">
        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <DocumentTextIcon className="w-8 h-8 text-blue-600" />
          Prescription
        </h3>
        
        {!prescription ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center">
              <ExclamationCircleIcon className="w-8 h-8" />
            </div>
            <p className="text-gray-500 font-bold text-lg">No prescription has been created for this appointment.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10 space-y-8">
            {/* Diagnosis */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                 Diagnosis
              </h4>
              <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
                 <p className="text-lg font-bold text-gray-900">{prescription.diagnosis}</p>
                 {prescription.notes && (
                   <p className="text-sm font-medium text-gray-600 mt-2">Symptoms: {prescription.notes}</p>
                 )}
              </div>
            </div>

            {/* Medicines */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
               <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                 <BeakerIcon className="w-4 h-4" /> Medicines
              </h4>
               <div className="overflow-x-auto rounded-2xl border border-gray-100">
                 <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Medicine</th>
                        <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Dosage</th>
                        <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Frequency</th>
                        <th className="p-4 text-xs font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {prescription.medicines?.map((med: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-bold text-gray-900">{med.name}</td>
                          <td className="p-4 font-semibold text-gray-600">{med.dosage}</td>
                          <td className="p-4 font-semibold text-gray-600">{med.frequency}</td>
                          <td className="p-4 font-semibold text-gray-600">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
               <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                 <ClipboardDocumentListIcon className="w-4 h-4" /> Additional Notes
              </h4>
              <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl">
                 <p className="text-gray-700 whitespace-pre-wrap">{prescription.notes || "No additional notes provided."}</p>
              </div>
            </div>

            {/* Follow up Date */}
            {prescription.followUpDate && (
              <div className="space-y-4 pt-6 border-t border-gray-100">
                 <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                   <CalendarIcon className="w-4 h-4" /> Follow-up Date
                </h4>
                <p className="text-lg font-bold text-gray-900">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
