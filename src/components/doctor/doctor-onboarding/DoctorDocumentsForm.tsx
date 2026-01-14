import { useRef, useState } from "react";
import { ZodError } from "zod";
import { doctorOnboardingApi } from "../../../api/doctorOnboardingApi";
import {
  doctorDocumentsSchema,

} from "../../../validation/doctorDocuments.schema";
import type {  DoctorDocumentsData} from "../../../validation/doctorDocuments.schema"

interface Props {
  userId: string;
  onNext: () => void;
}

export default function DoctorDocumentsForm({ userId, onNext }: Props) {
  const licenseRef = useRef<HTMLInputElement>(null);
const photoRef = useRef<HTMLInputElement>(null);
const certRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrors({});

  try {
    const licenseDocument =
      licenseRef.current?.files?.[0] || null;

    const profilePhoto =
      photoRef.current?.files?.[0] || null;

    const certifications = Array.from(
      certRef.current?.files || []
    );

    const parsed: DoctorDocumentsData =
      doctorDocumentsSchema.parse({
        licenseDocument,
        profilePhoto: profilePhoto ?? undefined,
        certifications,
      });

    const formData = new FormData();
    formData.append("licenseDocument", parsed.licenseDocument);

    if (parsed.profilePhoto) {
      formData.append("profilePhoto", parsed.profilePhoto);
    }

    parsed.certifications.forEach((file) =>
      formData.append("certifications", file)
    );

    setLoading(true);
    await doctorOnboardingApi.uploadDocuments(formData);
    onNext();
  } catch (err) {
    if (err instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      err.issues.forEach((e) => {
        fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({ form: "Upload failed. Try again." });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* License */}
      <div>
  <label className="block font-medium mb-1">
    Medical License <span className="text-red-500">*</span>
  </label>

  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded cursor-pointer hover:border-blue-500">
    <span className="text-gray-600">
      {licenseRef.current?.files?.[0]?.name ?? "Click to upload license"}
    </span>
    <input
      type="file"
      ref={licenseRef}
      accept="image/*"
      className="hidden"
    />
  </label>

  {errors.licenseDocument && (
    <p className="text-red-500 text-sm mt-1">
      {errors.licenseDocument}
    </p>
  )}
</div>


{/* Profile Photo */}
<div>
  <label className="block font-medium mb-1">
    Profile Photo (Optional)
  </label>

  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded cursor-pointer hover:border-blue-500">
    <span className="text-gray-600">
      {photoRef.current?.files?.[0]?.name ?? "Click to upload photo"}
    </span>
    <input
      type="file"
      ref={photoRef}
      accept="image/*"
      className="hidden"
    />
  </label>

  {errors.profilePhoto && (
    <p className="text-red-500 text-sm mt-1">
      {errors.profilePhoto}
    </p>
  )}
</div>

{/* Certifications */}
<div>
  <label className="block font-medium mb-1">
    Certifications <span className="text-red-500">*</span>
  </label>

  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded cursor-pointer hover:border-blue-500">
    <span className="text-gray-600">
      {certRef.current?.files?.length
        ? `${certRef.current.files.length} files selected`
        : "Click to upload certifications"}
    </span>
    <input
      type="file"
      multiple
      ref={certRef}
      accept="image/*"
      className="hidden"
    />
  </label>

  {errors.certifications && (
    <p className="text-red-500 text-sm mt-1">
      {errors.certifications}
    </p>
  )}
</div>

      {errors.form && (
        <p className="text-red-600">{errors.form}</p>
      )}

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded"
      >
        {loading ? "Uploading..." : "Continue →"}
      </button>
    </form>
  );
}
