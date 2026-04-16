import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/auth/authSlice";
import { doctorOnboardingApi } from "../api/doctorOnboardingApi";
import { uploadApi } from "../api/uploadApi";
import { showSuccess, showError, showLoading, dismissToast } from "../utils/toastUtils";
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  BanknotesIcon, 
  IdentificationIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  PhotoIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  CameraIcon
} from "@heroicons/react/24/outline";

export default function DoctorProfilePage() {
  const user = useAppSelector(selectCurrentUser);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showCerts, setShowCerts] = useState(false);
  
  // Edit State
  const [editForm, setEditForm] = useState({
    specialty: "",
    qualification: "",
    experience: 0,
    consultationFee: 100,
    aboutMe: "",
    profilePhoto: ""
  });
  const [updating, setUpdating] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await doctorOnboardingApi.getProfile();
      const doc = res.data.doctor;
      setProfile(doc);
      setEditForm({
        specialty: doc.specialty || "",
        qualification: doc.qualification || "",
        experience: doc.experience || 0,
        consultationFee: doc.consultationFee || 100,
        aboutMe: doc.aboutMe || "",
        profilePhoto: doc.profilePhoto || ""
      });
    } catch (err) {
      showError("Failed to load doctor profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // 📌 PART 7 & 8: INSTANT PHOTO UPDATE
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1️⃣ Validate: ONLY Image
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    // 2️⃣ Validate: Max 2MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("Profile photo must be smaller than 2MB");
      return;
    }

    setUploadingPhoto(true);
    const loadingToast = showLoading("Uploading new photo...");

    try {
      // 3️⃣ DIRECT UPLOAD to Cloudinary
      const signatureResponse = await uploadApi.getSignature("mediconnect/profiles");
      const imageUrl = await uploadApi.uploadToCloudinary(file, signatureResponse.data);

      // 4️⃣ CALL UPDATE API (Instant)
      await doctorOnboardingApi.updateBasicInfo({
        profilePhoto: imageUrl
      });

      // 5️⃣ UPDATE PREVIEW INSTANTLY
      setProfile((prev: any) => ({ ...prev, profilePhoto: imageUrl }));
      setEditForm((prev: any) => ({ ...prev, profilePhoto: imageUrl }));
      
      showSuccess("Profile photo updated!", loadingToast);
    } catch (err: any) {
      showError(err.response?.data?.message || "Upload failed", loadingToast);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (editForm.aboutMe.length < 20) {
      showError("About Me must be at least 20 characters");
      return;
    }
    if (editForm.experience < 0 || editForm.experience > 60) {
      showError("Experience must be between 0 and 60 years");
      return;
    }
    if (editForm.consultationFee < 100 || editForm.consultationFee > 10000) {
      showError("Fee must be between ₹100 and ₹10000");
      return;
    }

    setUpdating(true);
    try {
      await doctorOnboardingApi.updateBasicInfo(editForm);
      showSuccess("Profile updated successfully");
      setIsEditing(false);
      fetchProfile();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-12">
      <p className="text-gray-500">Profile not found. Please complete onboarding.</p>
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      SUBMITTED: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const labelMap: Record<string, string> = {
      APPROVED: "VERIFIED",
      SUBMITTED: "PENDING VERIFICATION",
      PENDING: "ONBOARDING",
      REJECTED: "REJECTED"
    };

    return (
      <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest border shadow-sm uppercase ${colors[status] || "bg-gray-100"}`}>
        {labelMap[status] || status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 px-8 py-12 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 📸 Profile Photo with Instant Update */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={profile.profilePhoto || "https://res.cloudinary.com/drt669z6p/image/upload/v1/mediconnect/profiles/default-avatar"} 
                  alt={user?.name}
                  className={`w-40 h-40 object-cover border-4 border-white/30 transition-all group-hover:scale-110 ${uploadingPhoto ? 'opacity-50 blur-sm' : ''}`}
                />
                
                {/* Overlay Button */}
                {!isEditing && (
                  <button 
                    onClick={() => profilePhotoRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  >
                    <CameraIcon className="w-8 h-8 text-white mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Change Photo</span>
                  </button>
                )}
              </div>
              
              <input 
                type="file"
                ref={profilePhotoRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />

              <div className="absolute -bottom-3 -right-3">
                {profile.verificationStatus === 'APPROVED' ? (
                  <div className="bg-white p-1 rounded-full shadow-lg">
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                  </div>
                ) : (
                  <div className="bg-white p-1 rounded-full shadow-lg">
                    <ClockIcon className="w-10 h-10 text-amber-500" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">{user?.name}</h1>
                <p className="text-indigo-200 text-xl font-medium mt-1 uppercase tracking-wide">
                  {profile.specialty || "Medical Professional"}
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <StatusBadge status={profile.verificationStatus} />
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold border border-white/20 backdrop-blur-sm transition-all"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-8 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Editable Fields */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Specialty</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={editForm.specialty}
                      onChange={e => setEditForm({...editForm, specialty: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Qualification</label>
                    <input 
                      type="text"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={editForm.qualification}
                      onChange={e => setEditForm({...editForm, qualification: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exp. (Years)</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={editForm.experience}
                        onChange={e => setEditForm({...editForm, experience: Number(e.target.value)})}
                        min="0" max="60"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Fee (₹)</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={editForm.consultationFee}
                        onChange={e => setEditForm({...editForm, consultationFee: Number(e.target.value)})}
                        min="100" max="10000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">About Me</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-[155px] resize-none"
                      value={editForm.aboutMe}
                      onChange={e => setEditForm({...editForm, aboutMe: e.target.value})}
                      placeholder="Write at least 20 characters..."
                      required
                    />
                  </div>
                  <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl">
                     <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">Photo Update Policy</p>
                     <p className="text-[10px] text-blue-600 leading-relaxed font-medium">To update your profile headshot, use the camera icon overlay on your existing photo in the header. Only high-quality images under 2MB are accepted.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  {updating ? "Saving Changes..." : "Save Professional Profile"}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Profile Details */}
              <div className="md:col-span-2 space-y-10">
                <section>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-3">
                    <UserIcon className="w-6 h-6 text-indigo-600" />
                    PROFESSIONAL SUMMARY
                  </h3>
                  <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-50 italic text-gray-700 leading-relaxed shadow-inner">
                    "{profile.aboutMe || "No description provided."}"
                  </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "QUALIFICATION", val: profile.qualification, icon: AcademicCapIcon },
                    { label: "EXPERIENCE", val: `${profile.experience} Years`, icon: BriefcaseIcon },
                    { label: "CONSULTATION FEE", val: `₹${profile.consultationFee}`, icon: BanknotesIcon },
                    { label: "REGISTRATION NO", val: profile.registrationNumber, icon: IdentificationIcon, locked: true },
                  ].map((item, i) => (
                    <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="w-5 h-5 text-indigo-500 transition-colors group-hover:text-indigo-600" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                        {item.locked && (
                          <div className="ml-auto bg-gray-100 text-[10px] px-2 py-0.5 rounded-full font-bold text-gray-500">LOCKED</div>
                        )}
                      </div>
                      <p className="text-gray-900 font-extrabold text-lg">{item.val || "N/A"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Documents */}
              <div className="space-y-6">
                <div className="p-8 bg-gray-900 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-lg font-black mb-6 border-l-4 border-indigo-500 pl-4 items-center">
                      PROFESSIONAL ARTIFACTS
                    </h4>
                    <div className="space-y-6">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <IdentificationIcon className="w-5 h-5 text-indigo-400" />
                              <span className="text-sm font-bold text-gray-300">License</span>
                            </div>
                            {profile.licenseDocument ? (
                              <a href={profile.licenseDocument} target="_blank" className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors">
                                <EyeIcon className="w-5 h-5" />
                              </a>
                            ) : <span className="text-xs text-red-400">MISSING</span>}
                         </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <AcademicCapIcon className="w-5 h-5 text-indigo-400" />
                              <span className="text-sm font-bold text-gray-300">Certifications</span>
                            </div>
                            <button 
                              onClick={() => setShowCerts(true)}
                              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                            >
                              <span className="bg-indigo-500 h-5 w-5 rounded-full flex items-center justify-center text-[10px]">
                                {profile.certifications?.length || 0}
                              </span>
                              VIEW ALL
                            </button>
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-gray-500 uppercase font-black tracking-widest text-center">
                      Documents Locked After Submission
                    </div>
                  </div>
                </div>

                {profile.rejectionReason && (
                  <div className="p-6 bg-red-50 rounded-2xl border border-red-100 animate-pulse">
                    <h4 className="font-black text-red-900 flex items-center gap-2 mb-2 text-sm">
                      <XCircleIcon className="w-5 h-5" />
                      REJECTION FEEDBACK
                    </h4>
                    <p className="text-xs text-red-700 font-bold leading-relaxed">{profile.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certifications Modal */}
      {showCerts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest">Medical Certifications</h3>
                <button onClick={() => setShowCerts(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <XMarkIcon className="w-8 h-8 text-gray-500" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {profile.certifications?.length > 0 ? (
                  profile.certifications.map((url: string, index: number) => (
                    <div key={index} className="group relative bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-indigo-300 transition-all shadow-sm hover:shadow-xl">
                      {url.toLowerCase().endsWith('.pdf') ? (
                        <div className="aspect-[4/3] flex flex-col items-center justify-center bg-indigo-50">
                          <DocumentArrowDownIcon className="w-16 h-16 text-indigo-400 mb-2" />
                          <span className="text-xs font-bold text-indigo-600">PDF DOCUMENT</span>
                        </div>
                      ) : (
                        <img src={url} alt={`Cert ${index}`} className="w-full aspect-[4/3] object-cover" />
                      )}
                      <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href={url} target="_blank" className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-black shadow-lg hover:scale-105 transition-transform">
                          VIEW FULL DOCUMENT
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20">
                    <AcademicCapIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No certifications uploaded</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
