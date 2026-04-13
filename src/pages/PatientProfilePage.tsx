import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getPatientProfile,
  createPatientProfile,
  updatePatientProfile,
} from "../store/patient/patientSlice";
import { toast } from "react-hot-toast";
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import { uploadApi } from "../api/uploadApi";

const PatientProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, status, error } = useAppSelector((state) => state.patient);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    age: "",
    dateOfBirth: "",
    gender: "MALE",
    phone: "",
    address: "",
    bloodGroup: "",
    allergies: [],
    medicalHistory: {},
    profileImage: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const signatureResponse = await uploadApi.getSignature("mediconnect/profiles");
      const imageUrl = await uploadApi.uploadToCloudinary(file, signatureResponse.data);
      
      setFormData((prev: any) => ({ ...prev, profileImage: imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    dispatch(getPatientProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
        gender: profile.gender || "MALE",
        phone: profile.phone || "",
        address: profile.address || "",
        bloodGroup: profile.bloodGroup || "",
        allergies: profile.allergies || [],
        medicalHistory: profile.medicalHistory || {},
        profileImage: profile.profileImage || "",
        emergencyContactName: profile.emergencyContactName || "",
        emergencyContactPhone: profile.emergencyContactPhone || "",
      });
      setIsEditing(false);
    } else if (status === "failed") {
        // If not found, we might want to stay in "create" mode
        setIsEditing(true);
    }
  }, [profile, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAllergiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      allergies: value.split(",").map((item) => item.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- STRICT FRONTEND VALIDATION ---
    const phoneRegex = /^[6-9]\d{9}$/;
    
    // Validate Primary Phone
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Enter a valid 10-digit primary phone number starting with 6-9");
      return;
    }

    // Validate Status/Existence
    if (!formData.name || !formData.dateOfBirth) {
      toast.error("Name and Date of Birth are mandatory fields");
      return;
    }

    // Validate DOB (Future & Extreme Age)
    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      toast.error("Date of Birth cannot be in the future");
      return;
    }

    // Validate Emergency Contact Phone
    if (formData.emergencyContactPhone && !phoneRegex.test(formData.emergencyContactPhone)) {
      toast.error("Enter a valid 10-digit emergency contact phone number starting with 6-9");
      return;
    }

    const payload = {
      ...formData,
      age: undefined, // Let backend calculate it
      dateOfBirth: formData.dateOfBirth,
    };

    try {
      if (profile) {
        await dispatch(updatePatientProfile(payload)).unwrap();
        toast.success("Profile updated successfully");
      } else {
        await dispatch(createPatientProfile(payload)).unwrap();
        toast.success("Profile created successfully");
      }
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err || "An error occurred");
    }
  };

  if (status === "loading" && !profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header/Cover */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="p-1 bg-white rounded-2xl shadow-md relative group">
              <div className="h-32 w-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-4 border-white">
                {formData.profileImage ? (
                   <img src={formData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : profile?.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-16 w-16 text-gray-400" />
                )}
                
                {isEditing && (
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    {isUploading ? (
                      <div className="h-6 w-6 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                    ) : (
                      <CameraIcon className="h-8 w-8 text-white" />
                    )}
                  </label>
                )}
              </div>
            </div>
            
            {!isEditing && profile && (
              <button
                onClick={() => setIsEditing(true)}
                className="mb-2 flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                id="edit-profile-btn"
              >
                <PencilIcon className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing && profile ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h1>
                  <p className="text-gray-500 flex items-center gap-2">
                    <UserGroupIcon className="h-4 w-4" />
                    Patient
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Age (Calculated)</p>
                    <p className="text-lg font-bold text-gray-800">
                      {profile.age} Years
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Blood Group</p>
                    <p className="text-lg font-bold text-red-600">{profile.bloodGroup || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                  <div className="flex items-center gap-4 group">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <PhoneIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                      <MapPinIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="text-sm font-medium">{profile.address || "No address provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition-colors">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date of Birth</p>
                      <p className="text-sm font-medium">
                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Medical Profile & Contacts</h3>
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg mt-1">
                      <XMarkIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Allergies</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profile.allergies && profile.allergies.length > 0 ? (
                          profile.allergies.map((allergy, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400 italic">None reported</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-1">
                      <DocumentTextIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Emergency Contact</p>
                      <p className="text-sm font-medium">{profile.emergencyContactName || "N/A"}</p>
                      <p className="text-xs text-gray-400">
                        {/^[6-9]\d{9}$/.test(profile.emergencyContactPhone || "") 
                          ? profile.emergencyContactPhone 
                          : profile.emergencyContactPhone 
                            ? "Invalid Number Format" 
                            : "No phone provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile ? "Edit Your Profile" : "Complete Your Profile"}
                </h2>
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                    placeholder="John Doe"
                    id="patient-name-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                    id="patient-dob-input"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Age will be calculated automatically</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                    id="patient-gender-select"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                    placeholder="9999999999"
                    id="patient-phone-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                    placeholder="Your complete address"
                    id="patient-address-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. O+"
                    id="patient-bloodgroup-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.allergies.join(", ")}
                    onChange={handleAllergiesChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Peanuts, Penicillin..."
                    id="patient-allergies-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Contact Name"
                    id="emergency-contact-name"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Contact Phone"
                    id="emergency-contact-phone"
                  />
                </div>
              </div>

              <div className="pt-6 border-t flex gap-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  id="save-profile-btn"
                >
                  {status === "loading" ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                  ) : (
                    <CheckIcon className="h-5 w-5" />
                  )}
                  {profile ? "Save Changes" : "Create Profile"}
                </button>
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      
      {error && !isEditing && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-3">
          <XMarkIcon className="h-5 w-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PatientProfilePage;
