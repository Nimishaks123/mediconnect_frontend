import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "../../validation/scheduleSchema";
import type { ScheduleFormData } from "../../validation/scheduleSchema";
export type CreateDoctorSchedulePayload = {
  rrule: string;
  timeWindows: {
    start: string;
    end: string;
  }[];
  slotDuration: number;
  validFrom: string;
  validTo: string;
  timezone: string;
};

type ScheduleFormProps = {
  onSubmit: (payload: CreateDoctorSchedulePayload) => void;
};

type TimeWindow = {
  start: string;
  end: string;
};

const DAYS = [
  { label: "Mon", value: "MO" },
  { label: "Tue", value: "TU" },
  { label: "Wed", value: "WE" },
  { label: "Thu", value: "TH" },
  { label: "Fri", value: "FR" },
  { label: "Sat", value: "SA" },
  { label: "Sun", value: "SU" },
];

export default function ScheduleForm({ onSubmit }: ScheduleFormProps) {
   



  /* ───────── state ───────── */

  const [frequency, setFrequency] =
    useState<"DAILY" | "WEEKLY">("WEEKLY");

  const [selectedDays, setSelectedDays] = useState<string[]>([
    "MO",
    "TU",
    "WE",
    "TH",
    "FR",
  ]);

  const [timeWindows, setTimeWindows] = useState<TimeWindow[]>([
    { start: "09:00", end: "12:00" },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      rrule: "",
      timeWindows: [],
    },
  });


const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const generateRRule = useCallback(() => {
    if (frequency === "DAILY") return "FREQ=DAILY";
    return `FREQ=WEEKLY;BYDAY=${selectedDays.join(",")}`;
  }, [frequency, selectedDays]);

  useEffect(() => {
    setValue("timeWindows", timeWindows, { shouldValidate: true });
    setValue("rrule", generateRRule(), { shouldValidate: true });
  }, [generateRRule, setValue, timeWindows]);

  const addTimeWindow = () => {
    setTimeWindows([...timeWindows, { start: "", end: "" }]);
  };

  const removeTimeWindow = (index: number) => {
    setTimeWindows(timeWindows.filter((_, i) => i !== index));
  };


  const submitHandler = (data: ScheduleFormData) => {
    const cleanedTimeWindows = timeWindows.filter(
      (w) => w.start && w.end && w.start < w.end
    );

    if (cleanedTimeWindows.length === 0) {
      setValue("timeWindows", [], { shouldValidate: true });
      return;
    }

    const rrule = generateRRule();

    setValue("rrule", rrule, { shouldValidate: true });
    setValue("timeWindows", cleanedTimeWindows, { shouldValidate: true });

    onSubmit({
      rrule,
      timeWindows: cleanedTimeWindows,
      slotDuration: data.slotDuration,
      validFrom: data.validFrom,
      validTo: data.validTo,
      timezone: "Asia/Kolkata",
    });
  };


  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 bg-white p-6 rounded-xl shadow"
    >
      <h2 className="text-xl font-semibold">
        Set Your Availability
      </h2>

      {/* TIME WINDOWS */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Time Ranges
        </label>

        {timeWindows.map((window, index) => (
          <div key={index} className="flex items-center gap-3 mb-2">
            <input
              type="time"
              value={window.start}
              onChange={(e) => {
                const copy = [...timeWindows];
                copy[index].start = e.target.value;
                setTimeWindows(copy);
              }}
              className="border rounded-lg px-3 py-2"
            />

            <span className="text-gray-500">to</span>

            <input
              type="time"
              value={window.end}
              onChange={(e) => {
                const copy = [...timeWindows];
                copy[index].end = e.target.value;
                setTimeWindows(copy);
              }}
              className="border rounded-lg px-3 py-2"
            />

            {timeWindows.length > 1 && (
              <button
                type="button"
                onClick={() => removeTimeWindow(index)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {errors.timeWindows && (
          <p className="text-red-500 text-xs mt-1">
            {errors.timeWindows.message}
          </p>
        )}

        <button
          type="button"
          onClick={addTimeWindow}
          className="text-sm text-sky-600 mt-2"
        >
          + Add another time range
        </button>
      </div>

      {/* SLOT DURATION */}
      <div>
        <label className="text-sm font-medium">
          Slot Duration (minutes)
        </label>
        <input
          type="number"
          {...register("slotDuration", { valueAsNumber: true })}
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors.slotDuration && (
          <p className="text-red-500 text-xs">
            {errors.slotDuration.message}
          </p>
        )}
      </div>

      {/* FREQUENCY */}
      <div>
        <label className="text-sm font-medium">
          Schedule Type
        </label>
        <select
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as "DAILY" | "WEEKLY")
          }
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly (Specific Days)</option>
        </select>
      </div>

      {/* DAYS */}
      {frequency === "WEEKLY" && (
        <div>
          <label className="text-sm font-medium mb-2 block">
            Working Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                type="button"
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  selectedDays.includes(day.value)
                    ? "bg-sky-600 text-white"
                    : "bg-white"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {errors.rrule && (
            <p className="text-red-500 text-xs mt-1">
              {errors.rrule.message}
            </p>
          )}
        </div>
      )}

      {/* DATE RANGE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">
            Valid From
          </label>
          <input
            type="date"
            {...register("validFrom")}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.validFrom && (
  <p className="text-red-500 text-xs">
    {errors.validFrom.message}
  </p>
)}

        </div>

        <div>
          <label className="text-sm font-medium">
            Valid To
          </label>
          <input
            type="date"
            {...register("validTo")}
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.validTo && (
            <p className="text-red-500 text-xs">
              {errors.validTo.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700"
      >
        Save Schedule
      </button>
    </form>
  );
}
