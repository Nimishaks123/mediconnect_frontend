import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Doctor } from "../../types/Doctor";

import defaultDoctor from "../../assets/default-doctor.jpeg";

import { ROUTES } from "../../constants/routes";

import Pagination from "../common/Pagination";

type Props = {
  doctors: Doctor[];
  loading?: boolean;

  specialties: string[];

  selectedSpecialty: string;
  onSpecialtyChange: (
    value: string
  ) => void;

  selectedExperience: string;
  onExperienceChange: (
    value: string
  ) => void;

  currentPage: number;
  total: number;

  onPageChange: (
    page: number
  ) => void;
};

export default function SpecialistsList({
  doctors,
  loading,

  specialties,

  selectedSpecialty,
  onSpecialtyChange,

  selectedExperience,
  onExperienceChange,

  currentPage,
  total,

  onPageChange,
}: Props) {
  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const filteredDoctors =
    doctors.filter((doctor) =>
      doctor.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading doctors...
      </p>
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

        <div className="flex gap-3">

          {/* SPECIALTY */}
          <select
            value={selectedSpecialty}
            onChange={(e) =>
              onSpecialtyChange(
                e.target.value
              )
            }
            className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
          >
            <option value="">
              All Specialties
            </option>

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

          {/* EXPERIENCE */}
          <select
            value={selectedExperience}
            onChange={(e) =>
              onExperienceChange(
                e.target.value
              )
            }
            className="border border-gray-200 rounded-xl px-4 py-3 bg-white"
          >
            <option value="">
              All Experience
            </option>

            <option value="1">
              1+ Years
            </option>

            <option value="3">
              3+ Years
            </option>

            <option value="5">
              5+ Years
            </option>

            <option value="10">
              10+ Years
            </option>
          </select>

        </div>

      </div>

      {/* GRID */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> */}

        {/* {filteredDoctors.map(
          (doc) => { */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
  {filteredDoctors.length === 0 ? (
    <div className="col-span-full bg-white rounded-2xl p-10 text-center shadow-sm">
      <p className="text-lg font-medium text-gray-600">
        No doctors found
      </p>

      <p className="text-sm text-gray-400 mt-2">
        Try changing the search term or filters.
      </p>
    </div>
  ) : (
    filteredDoctors.map((doc) => {

            const dId =
              doc.doctorId ||
              doc.id;

            if (!dId)
              return null;

            return (
              <div
                key={dId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300"
              >

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

                <div className="mt-4 text-center">

                  <h3 className="text-lg font-semibold text-gray-900">
                    Dr. {doc.name}
                  </h3>

                  <p className="text-sky-600 font-medium mt-1">
                    {doc.specialty}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">

                    <p>
                      {doc.experience}
                      {" "}
                      years experience
                    </p>

                    <p>
                      Consultation Fee:

                      <span className="font-semibold text-gray-900 ml-1">
                        ₹
                        {doc.consultationFee}
                      </span>

                    </p>
                    

                  </div>

                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() =>
                        navigate(
                          ROUTES.DOCTOR_DETAILS(
                            dId
                          )
                        )
                      }
                      className="flex-1 border border-sky-600 text-sky-600 py-2 rounded-xl font-medium hover:bg-sky-50"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/patient/appointments/${dId}`
                        )
                      }
                      className="flex-1 bg-sky-600 text-white py-2 rounded-xl font-medium hover:bg-sky-700"
                    >
                      Book
                    </button>

                  </div>

                </div>

              </div>
            );
          })
        
        )}

      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={
          Math.ceil(total / 2)
        }
        onPageChange={
          onPageChange
        }
      />

    </div>
  );
}