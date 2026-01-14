import { useState } from "react";
import { ZodError } from "zod";
import { doctorOnboardingApi } from "../../../api/doctorOnboardingApi";
import {
  doctorBasicInfoSchema,
} from "../../../validation/doctorBasicInfo.schema";
import type { DoctorBasicInfoData } from "../../../validation/doctorBasicInfo.schema";

interface Props {
  userId: string;
  onSuccess: () => void;
}

export default function DoctorBasicInfoForm({
  userId,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    specialty: "",
    qualification: "",
    experience: "",
    consultationFee: "",
    registrationNumber: "",
    aboutMe: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // ✅ clear only this field’s error
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // ✅ SINGLE correct parse call
      const parsed: DoctorBasicInfoData =
        doctorBasicInfoSchema.parse(form);

      setLoading(true);
      await doctorOnboardingApi.updateBasicInfo(parsed);
      onSuccess();
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: "Failed to save information" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="specialty"
        placeholder="Specialty"
        value={form.specialty}
        onChange={handleChange}
        className="border p-3 w-full rounded"
      />
      {errors.specialty && <p className="text-red-500">{errors.specialty}</p>}

      <input
        name="qualification"
        placeholder="Qualification"
        value={form.qualification}
        onChange={handleChange}
        className="border p-3 w-full rounded"
      />
      {errors.qualification && (
        <p className="text-red-500">{errors.qualification}</p>
      )}

      <input
        name="experience"
        type="number"
        placeholder="Experience"
        value={form.experience}
        onChange={handleChange}
        className="border p-3 w-full rounded"
      />
      {errors.experience && (
        <p className="text-red-500">{errors.experience}</p>
      )}

      <input
        name="consultationFee"
        type="number"
        placeholder="Consultation Fee"
        value={form.consultationFee}
        onChange={handleChange}
        className="border p-3 w-full rounded"
      />
      {errors.consultationFee && (
        <p className="text-red-500">{errors.consultationFee}</p>
      )}

      <input
        name="registrationNumber"
        placeholder="Registration Number"
        value={form.registrationNumber}
        onChange={handleChange}
        className="border p-3 w-full rounded"
      />
      {errors.registrationNumber && (
        <p className="text-red-500">{errors.registrationNumber}</p>
      )}

      <textarea
        name="aboutMe"
        placeholder="About yourself"
        value={form.aboutMe}
        onChange={handleChange}
        className="border p-3 w-full rounded h-32"
      />
      {errors.aboutMe && <p className="text-red-500">{errors.aboutMe}</p>}

      {errors.form && <p className="text-red-600">{errors.form}</p>}

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {loading ? "Saving..." : "Continue →"}
      </button>
    </form>
  );
}
