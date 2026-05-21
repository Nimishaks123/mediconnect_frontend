
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { toast }
from "react-hot-toast";

import {
  getDoctorById,
} from "../api/doctors";

import defaultDoctor
from "../assets/default-doctor.jpeg";

import {
  Star,
  MapPin,
  Clock,
  Globe,
  GraduationCap,
  CalendarDays,
  Video,
} from "lucide-react";

export default function DoctorDetailsPage() {

  const navigate =
    useNavigate();

  const { doctorId } =
    useParams();

  const [doctor, setDoctor] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (!doctorId) return;

    const fetchDoctor =
      async () => {

        try {

          const res =
            await getDoctorById(
              doctorId
            );

          console.log(
            "Doctor details:",
            res.data
          );

          setDoctor(res.data);

        } catch (error) {

          toast.error(
            "Failed to load doctor details"
          );

        } finally {

          setLoading(false);

        }
      };

    fetchDoctor();

  }, [doctorId]);

  // LOADING
  if (loading) {

    return (
      <div className="p-10 text-center text-gray-500">
        Loading doctor details...
      </div>
    );
  }

  // NOT FOUND
  if (!doctor) {

    return (
      <div className="p-10 text-center text-red-500">
        Doctor not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* BREADCRUMB */}
        <div className="mb-6 text-sm text-gray-500">

          Find Doctors
          {" / "}

          <span className="text-gray-900 font-medium">
            Doctor Details
          </span>

        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="xl:col-span-2 space-y-6">

            {/* HERO CARD */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

              <div className="flex flex-col md:flex-row gap-8">

                {/* IMAGE */}
                <div className="flex-shrink-0">

                  <img
                    src={
                      doctor.profilePhoto ||
                      defaultDoctor
                    }
                    alt="Doctor"
                    className="w-52 h-52 object-cover rounded-3xl bg-gray-100"
                  />

                </div>

                {/* INFO */}
                <div className="flex-1 space-y-5">

                  {/* NAME */}
                  <div>

                    <div className="flex items-center gap-3 flex-wrap">

                      <h1 className="text-4xl font-bold text-gray-900">

                        {
                          doctor.name ||
                          "Dr. Specialist"
                        }

                      </h1>

                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">

                        <Star className="w-4 h-4 fill-yellow-500" />

                        4.9

                      </div>

                    </div>

                    <p className="text-sky-600 text-lg font-medium mt-2 capitalize">

                      {
                        doctor.specialty ||
                        "Specialist"
                      }

                    </p>

                  </div>

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-3">

                    <div className="bg-sky-50 text-sky-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">

                      <Clock className="w-4 h-4" />

                      {
                        doctor.experience || 0
                      }{" "}
                      Years Experience

                    </div>

                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">

                      <CalendarDays className="w-4 h-4" />

                      Available Today

                    </div>

                    <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">

                      <Video className="w-4 h-4" />

                      Video Consultation

                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="space-y-3">

                    <div className="flex items-center gap-3 text-gray-600">

                      <MapPin className="w-5 h-5 text-gray-400" />

                      <span>
                        MediConnect Medical Center,
                        Kerala
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-gray-600">

                      <Globe className="w-5 h-5 text-gray-400" />

                      <span>
                        English, Malayalam
                      </span>

                    </div>

                  </div>

                  {/* ABOUT */}
                  <p className="text-gray-600 leading-relaxed">

                    {
                      doctor.aboutMe ||
                      "No description available"
                    }

                  </p>

                </div>
              </div>
            </div>

            {/* ABOUT SECTION */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

              <h2 className="text-2xl font-bold text-gray-900 mb-6">

                About Doctor

              </h2>

              <p className="text-gray-600 leading-8">

                {
                  doctor.aboutMe ||
                  "No information available"
                }

              </p>

            </div>

            {/* EDUCATION */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

              <div className="flex items-center gap-3 mb-6">

                <GraduationCap className="w-6 h-6 text-sky-600" />

                <h2 className="text-2xl font-bold text-gray-900">

                  Qualification

                </h2>

              </div>

              <div className="flex items-start gap-3">

                <div className="w-2 h-2 rounded-full bg-sky-500 mt-3" />

                <p className="text-gray-700">

                  {
                    doctor.qualification ||
                    "Qualification not available"
                  }

                </p>

              </div>

            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* BOOKING CARD */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">

              <div className="space-y-6">

                {/* FEE */}
                <div>

                  <p className="text-gray-500 text-sm">
                    Consultation Fee
                  </p>

                  <h2 className="text-4xl font-bold text-gray-900 mt-2">

                    ₹{
                      doctor.consultationFee || 0
                    }

                  </h2>

                </div>

                {/* STATUS */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-3 h-3 rounded-full bg-green-500" />

                    <div>

                      <p className="font-semibold text-green-700">
                        Available Today
                      </p>

                      <p className="text-sm text-green-600">
                        Instant appointment confirmation
                      </p>

                    </div>

                  </div>

                </div>

                {/* FEATURES */}
                <div className="space-y-4">

                  <div className="flex items-center gap-3 text-gray-600">

                    <Video className="w-5 h-5 text-sky-600" />

                    <span>
                      Video Consultation Available
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-gray-600">

                    <Clock className="w-5 h-5 text-sky-600" />

                    <span>
                      30 Minutes Consultation
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-gray-600">

                    <Star className="w-5 h-5 text-sky-600" />

                    <span>
                      Trusted Healthcare Specialist
                    </span>

                  </div>

                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    navigate(
                      `/patient/appointments/${doctor._id}`
                    )
                  }
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-2xl font-semibold text-lg transition-all shadow-sm hover:shadow-md"
                >

                  Book Appointment

                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}