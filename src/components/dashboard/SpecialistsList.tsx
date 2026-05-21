import {
  useMemo,
  useState,
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import type {
  Doctor
} from "../../types/Doctor";

import defaultDoctor
from "../../assets/default-doctor.jpeg";

import {
  ROUTES
} from "../../constants/routes";

type Props = {
  doctors: Doctor[];
  loading?: boolean;
};

export default function SpecialistsList({
  doctors,
  loading,
}: Props) {

  const navigate =
    useNavigate();

  const [search, setSearch] =
    useState("");

  const [specialty, setSpecialty] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const doctorsPerPage = 6;

  // REMOVE DUPLICATES
  const uniqueDoctors =
    useMemo(() => {

      return doctors.filter(

        (doctor, index, self) =>

          index ===
          self.findIndex(

            (d) =>

              (d.id || d.doctorId) ===
              (doctor.id || doctor.doctorId)
          )
      );

    }, [doctors]);

  // SPECIALTY LIST
  const specialties =
    useMemo(() => {

      const specs =
        uniqueDoctors.map(
          (d) => d.specialty
        );

      return [
        "All",
        ...new Set(specs)
      ];

    }, [uniqueDoctors]);

  // FILTERED DOCTORS
  const filteredDoctors =
    useMemo(() => {

      return uniqueDoctors.filter(
        (doctor) => {

          const matchesSearch =
            doctor.name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesSpecialty =

            specialty === "All" ||

            doctor.specialty ===
            specialty;

          return (
            matchesSearch &&
            matchesSpecialty
          );
        }
      );

    }, [
      uniqueDoctors,
      search,
      specialty
    ]);

  // RESET PAGE WHEN FILTER CHANGES
  useEffect(() => {

    setCurrentPage(1);

  }, [search, specialty]);

  // PAGINATION
  const totalPages =
    Math.ceil(
      filteredDoctors.length /
      doctorsPerPage
    );

  const paginatedDoctors =
    filteredDoctors.slice(

      (currentPage - 1) *
        doctorsPerPage,

      currentPage *
        doctorsPerPage
    );

  if (loading) {

    return (

      <p className="text-center text-gray-500">
        Loading doctors...
      </p>
    );
  }

  if (!filteredDoctors.length) {

    return (

      <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

        <p className="text-gray-500">
          No doctors found
        </p>

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="w-full md:w-80 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* FILTER */}
        <select
          value={specialty}
          onChange={(e) =>
            setSpecialty(
              e.target.value
            )
          }
          className="border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
        >

          {specialties.map(
            (spec) => (

              <option
                key={spec}
                value={spec}
              >
                {spec}
              </option>
            )
          )}

        </select>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {paginatedDoctors.map(
          (doc) => {

            const docWithIds =
              doc as Doctor & {
                doctorId?: string;
              };

            const dId =
              docWithIds.doctorId ||
              docWithIds.id;

            if (!dId)
              return null;

            return (

              <div
                key={dId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
              >

                {/* IMAGE */}
                <div className="flex justify-center">

                  <img
                    src={
                      doc.profilePhoto ||
                      defaultDoctor
                    }
                    alt={doc.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-sky-100"
                    onError={(e) => {
                      e.currentTarget.src =
                        defaultDoctor;
                    }}
                  />

                </div>

                {/* INFO */}
                <div className="mt-4 text-center">

                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {doc.name}
                  </h3>

                  <p className="text-sky-600 font-medium mt-1">
                    {doc.specialty}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">

                    {doc.experience && (

                      <p>
                        {doc.experience}
                        years experience
                      </p>
                    )}

                    {doc.consultationFee && (

                      <p>
                        Consultation Fee:

                        <span className="font-semibold text-gray-900 ml-1">
                          ₹
                          {doc.consultationFee}
                        </span>

                      </p>
                    )}

                  </div>

                  {/* BUTTONS */}
                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() => {

                        navigate(
                          ROUTES.DOCTOR_DETAILS(
                            dId
                          )
                        );
                      }}
                      className="flex-1 border border-sky-600 text-sky-600 py-2 rounded-xl font-medium hover:bg-sky-50 transition"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {

                        navigate(
                          `/patient/appointments/${dId}`
                        );
                      }}
                      className="flex-1 bg-sky-600 text-white py-2 rounded-xl font-medium hover:bg-sky-700 transition"
                    >
                      Book
                    </button>

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (

        <div className="flex justify-center items-center gap-3 pt-6">

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev - 1
              )
            }
            className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-2">

            {Array.from({
              length: totalPages
            }).map((_, index) => (

              <button
                key={index}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  currentPage ===
                  index + 1
                    ? "bg-sky-600 text-white"
                    : "bg-white border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

          </div>

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (prev) => prev + 1
              )
            }
            className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}

    </div>
  );
}