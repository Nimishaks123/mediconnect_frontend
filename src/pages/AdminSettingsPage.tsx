import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

import {
  getPlatformSettings,
  updatePlatformSettings,
} from "../api/platformSettingsApi";

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState(0);
  const [refundPercentage, setRefundPercentage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const data = await getPlatformSettings();

      setPlatformFee(data.platformFee);
      setRefundPercentage(data.refundPercentage);
    } catch (error) {
      toast.error("Failed to load platform settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updatePlatformSettings({
        platformFee,
        refundPercentage,
      });

      toast.success("Platform settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 animate-pulse">

        <div className="h-12 w-72 bg-gray-200 rounded-xl mb-3" />

        <div className="h-5 w-96 bg-gray-100 rounded-lg mb-10" />

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-10">

          <div className="space-y-8">

            <div className="h-5 bg-gray-100 rounded w-40"></div>

            <div className="h-14 bg-gray-100 rounded-2xl"></div>

            <div className="h-5 bg-gray-100 rounded w-48"></div>

            <div className="h-14 bg-gray-100 rounded-2xl"></div>

            <div className="h-14 w-48 bg-gray-100 rounded-2xl"></div>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="max-w-7xl mx-auto p-8 animate-in fade-in duration-700">

      <div className="flex items-center justify-between mb-10">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <Cog6ToothIcon className="w-8 h-8 text-blue-600" />

            </div>

            <div>

              <h1 className="text-4xl font-black tracking-tight text-gray-900">

                Platform Settings

              </h1>

              <p className="text-gray-500 mt-1 font-medium">

                Configure platform fees and refund policy.

              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left Side */}

        <div className="lg:col-span-2">

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 p-10">

            <div className="flex items-center gap-3 mb-8">

              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />

              <h2 className="text-2xl font-black text-gray-900">

                Business Configuration

              </h2>

            </div>
                        {/* Platform Fee */}

            <div className="mb-8">

              <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-3">

                Platform Fee

              </label>

              <div className="relative">

                <CurrencyRupeeIcon
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500"
                />

                <input
                  type="number"
                  min={0}
                  value={platformFee}
                  onChange={(e) =>
                    setPlatformFee(Number(e.target.value))
                  }
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-lg font-bold text-gray-900"
                />

              </div>

              <p className="text-gray-400 text-sm mt-3 leading-relaxed">

                This fixed amount will be deducted from every completed
                appointment before crediting the doctor's wallet.

              </p>

            </div>

            {/* Refund Percentage */}

            <div className="mb-10">

              <label className="block text-sm font-black uppercase tracking-widest text-gray-500 mb-3">

                Refund Percentage

              </label>

              <div className="relative">

                <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-blue-600 text-xl">

                  %

                </span>

                <input
                  type="number"
                  min={0}
                  max={100}
                  value={refundPercentage}
                  onChange={(e) =>
                    setRefundPercentage(Number(e.target.value))
                  }
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all text-lg font-bold text-gray-900"
                />

              </div>

              <p className="text-gray-400 text-sm mt-3 leading-relaxed">

                Percentage refunded to patients when they cancel an
                appointment according to your cancellation policy.

              </p>

            </div>

            <div className="flex justify-end">

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black tracking-wide transition-all shadow-lg shadow-blue-200"
              >

                {saving ? (

                  <>

                    <ArrowPathIcon className="w-5 h-5 animate-spin" />

                    Saving...

                  </>

                ) : (

                  <>

                    <Cog6ToothIcon className="w-5 h-5" />

                    Save Settings

                  </>

                )}

              </button>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-6">

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] text-white p-8 shadow-xl">

            <h3 className="text-xl font-black mb-6">

              Current Configuration

            </h3>

            <div className="space-y-6">

              <div>

                <p className="text-blue-100 uppercase tracking-widest text-xs font-bold">

                  Platform Fee

                </p>

                <h2 className="text-4xl font-black mt-2">

                  ₹{platformFee}

                </h2>

              </div>

              <div className="border-t border-white/20 pt-6">

                <p className="text-blue-100 uppercase tracking-widest text-xs font-bold">

                  Refund Percentage

                </p>

                <h2 className="text-4xl font-black mt-2">

                  {refundPercentage}%

                </h2>

              </div>

            </div>

          </div>
                    {/* Information Card */}

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-lg p-8">

            <h3 className="text-xl font-black text-gray-900 mb-5">

              Important Notes

            </h3>

            <div className="space-y-5">

              <div className="flex items-start gap-4">

                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 flex-shrink-0" />

                <p className="text-gray-600 leading-relaxed text-sm">

                  Platform fee is deducted from every successfully completed
                  consultation before the remaining amount is credited to the
                  doctor's wallet.

                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />

                <p className="text-gray-600 leading-relaxed text-sm">

                  Refund percentage is applied only when a patient is eligible
                  for a refund according to your cancellation policy.

                </p>

              </div>

              <div className="flex items-start gap-4">

                <div className="w-3 h-3 rounded-full bg-amber-500 mt-2 flex-shrink-0" />

                <p className="text-gray-600 leading-relaxed text-sm">

                  Changes are applied immediately and will affect future
                  appointment settlements and refunds.

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}