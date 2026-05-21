
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getDoctorSlotsForPatient,
} from "../api/schedule";

import type {
  DoctorSlot,
} from "../api/schedule";

import {
  createAppointment,
} from "../api/appointments";

import {
  createCheckoutSession,
} from "../api/paymentApi";

import {
  getMyWallet,
  payWithWallet,
} from "../api/patientAppointments";

import { toast } from "react-hot-toast";

const DAYS_TO_SHOW = 7;

const getLocalDateString = (
  date: Date
) => {

  const y = date.getFullYear();

  const m = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const d = String(
    date.getDate()
  ).padStart(2, "0");

  return `${y}-${m}-${d}`;
};

export default function DoctorAppointmentPage() {

  const navigate = useNavigate();

  const { doctorId } =
    useParams<{
      doctorId: string;
    }>();

  const today =
    getLocalDateString(
      new Date()
    );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(today);

  const [
    slots,
    setSlots,
  ] = useState<DoctorSlot[]>(
    []
  );

  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState<DoctorSlot | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    paymentMethod,
    setPaymentMethod
  ] = useState<
    "STRIPE" | "WALLET"
  >("STRIPE");

  const [
    walletBalance,
    setWalletBalance
  ] = useState(0);

  // FETCH SLOTS
  useEffect(() => {

    if (
      !doctorId ||
      doctorId === "undefined"
    ) {
      return;
    }

    setLoading(true);

    setSelectedSlot(null);

    getDoctorSlotsForPatient(
      doctorId,
      selectedDate,
      selectedDate
    )
      .then((res) => {

        setSlots(res.data);

      })
      .catch(() => {

        toast.error(
          "Failed to load slots"
        );

      })
      .finally(() => {

        setLoading(false);

      });

  }, [doctorId, selectedDate]);

  // FETCH WALLET
  useEffect(() => {

    getMyWallet()
      .then((res) => {

        setWalletBalance(
          res.balance || 0
        );

      })
      .catch(() => {

        console.log(
          "Failed to fetch wallet"
        );

      });

  }, []);

  const getNextDays = () => {

    return Array.from({
      length: DAYS_TO_SHOW,
    }).map((_, i) => {

      const d = new Date();

      d.setDate(
        d.getDate() + i
      );

      return getLocalDateString(d);

    });

  };

  // FILTER EXPIRED SLOTS
  const slotsForDate = slots.filter(
    (slot) => {

      if (
        slot.date !==
        selectedDate
      ) {
        return false;
      }

      const now =
        new Date();

      const slotEndDateTime =
        new Date(
          `${slot.date}T${slot.endTime}`
        );

      return (
        slotEndDateTime > now
      );
    }
  );

  const handleConfirmAppointment =
    async () => {

      if (
        !selectedSlot ||
        !doctorId ||
        doctorId === "undefined"
      ) {
        return;
      }

      try {

        setLoading(true);

        const start =
          selectedSlot.startTime;

        const end =
          selectedSlot.endTime;

        const slotId =
`${doctorId}_${selectedDate}_${start}_${end}`;

        // CREATE APPOINTMENT
        const appointmentRes =
          await createAppointment({
            doctorId,
            slotId,
            date: selectedDate,
          });

        const appointmentId =
          appointmentRes._id ||
          appointmentRes.appointmentId;

        // WALLET PAYMENT
        if (
          paymentMethod ===
          "WALLET"
        ) {

          await payWithWallet(
            appointmentId
          );

          toast.success(
            "Appointment confirmed using wallet"
          );

          navigate(
            "/patient/appointments"
          );

          return;
        }

        // STRIPE PAYMENT
        const paymentRes =
          await createCheckoutSession(
            appointmentId
          );

        window.location.href =
          paymentRes.checkoutUrl;

      } catch (err: unknown) {

        const error =
          err as {
            response?: {
              data?: {
                message?: string;
              };
            };
          };

        toast.error(
          error.response?.data
            ?.message ||
          "Unable to proceed to payment"
        );

      } finally {

        setLoading(false);

      }
    };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER */}
      <div className="space-y-2">

        <h1 className="text-3xl font-bold text-gray-900">
          Book Appointment
        </h1>

        <p className="text-gray-500">
          Choose your preferred consultation slot
        </p>

      </div>

      {/* DATE SELECTOR */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Select Date
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-1">

          {getNextDays().map(
            (date) => (

              <button
                key={date}
                onClick={() =>
                  setSelectedDate(
                    date
                  )
                }
                className={`px-4 py-3 rounded-xl border text-sm whitespace-nowrap transition-all
                ${
                  selectedDate === date
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-white hover:bg-sky-50 border-gray-200"
                }`}
              >

                {new Date(date)
                  .toDateString()
                  .slice(0, 10)}

              </button>
            )
          )}

        </div>
      </div>

      {/* SLOT SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-lg font-semibold text-gray-800">
            Available Slots
          </h2>

          {!loading &&
            slotsForDate.length > 0 && (
              <span className="text-sm text-gray-500">
                {slotsForDate.length} slots available
              </span>
            )}

        </div>

        {loading && (
          <p className="text-gray-500 text-sm">
            Loading available slots...
          </p>
        )}

        {!loading &&
          slotsForDate.length === 0 && (
            <div className="text-center py-10">

              <p className="text-gray-500">
                No slots available for this date
              </p>

            </div>
          )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {slotsForDate.map(
            (slot) => {

              const isSelected =
                selectedSlot === slot;

              return (
                <button
                  key={`${slot.date}-${slot.startTime}-${slot.endTime}`}
                  onClick={() =>
                    setSelectedSlot(slot)
                  }
                  className={`rounded-2xl border p-4 text-left transition-all
                  ${
                    isSelected
                      ? "bg-sky-600 text-white border-sky-600 shadow-md"
                      : "bg-white hover:bg-sky-50 border-gray-200"
                  }`}
                >

                  <p className="font-semibold text-sm">
                    {slot.startTime} – {slot.endTime}
                  </p>

                  <p
                    className={`text-xs mt-2
                    ${
                      isSelected
                        ? "text-sky-100"
                        : "text-gray-500"
                    }`}
                  >
                    Available
                  </p>

                </button>
              );
            }
          )}

        </div>
      </div>

      {/* CONFIRM SECTION */}
      {selectedSlot && (

        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 shadow-sm">

          <h3 className="font-semibold text-gray-900 mb-3">
            Selected Appointment
          </h3>

          <div className="space-y-2 text-sm text-gray-700">

            <p>
              <span className="font-medium">
                Date:
              </span>{" "}
              {new Date(
                selectedDate
              ).toDateString()}
            </p>

            <p>
              <span className="font-medium">
                Time:
              </span>{" "}
              {selectedSlot.startTime}
              {" – "}
              {selectedSlot.endTime}
            </p>

          </div>

          {/* PAYMENT METHOD */}
          <div className="mt-5 space-y-3">

            <h4 className="font-semibold text-gray-800">
              Payment Method
            </h4>

            {/* WALLET */}
            <label className="flex items-center justify-between border rounded-xl p-4 bg-white cursor-pointer">

              <div>
                <p className="font-medium">
                  Wallet Balance
                </p>

                <p className="text-sm text-gray-500">
                  ₹{walletBalance}
                </p>
              </div>

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "WALLET"
                }
                onChange={() =>
                  setPaymentMethod(
                    "WALLET"
                  )
                }
              />

            </label>

            {/* STRIPE */}
            <label className="flex items-center justify-between border rounded-xl p-4 bg-white cursor-pointer">

              <div>
                <p className="font-medium">
                  Stripe / Card
                </p>

                <p className="text-sm text-gray-500">
                  Secure online payment
                </p>
              </div>

              <input
                type="radio"
                checked={
                  paymentMethod ===
                  "STRIPE"
                }
                onChange={() =>
                  setPaymentMethod(
                    "STRIPE"
                  )
                }
              />

            </label>

          </div>

          <button
            onClick={
              handleConfirmAppointment
            }
            disabled={loading}
            className="mt-6 w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
          >

            {loading
              ? "Processing..."
              : "Proceed to Payment"}

          </button>

        </div>
      )}

    </div>
  );
}