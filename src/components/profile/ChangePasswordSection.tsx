import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  changePasswordFormSchema,
  type changePasswordFormData,
} from "../../validation/changePasswordSchema";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changePassword } from "../../store/auth/authSlice";

import {
  showSuccess,
  showError,
} from "../../utils/toastUtils";

export default function ChangePasswordSection() {
  const dispatch = useAppDispatch();

  const authStatus = useAppSelector(
    (state) => state.auth.status
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<changePasswordFormData>({
    resolver: zodResolver(
      changePasswordFormSchema
    ),
  });

  const onSubmit = async (
    data: changePasswordFormData
  ) => {
      console.log("FORM DATA:", data);
    const result = await dispatch(
      changePassword({
        currentPassword:
          data.currentPassword,
        newPassword:
          data.newPassword,
      })
    );

    if (
      changePassword.fulfilled.match(
        result
      )
    ) {
      showSuccess(
        "Password changed successfully"
      );

      reset();
    } else {
      showError(
        result.payload as string
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Security
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>

          <input
            type="password"
            {...register("currentPassword")}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {errors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {
                errors.currentPassword
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>

          <input
            type="password"
            {...register("newPassword")}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {
                errors.newPassword
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>

          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {
                errors.confirmPassword
                  .message
              }
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            authStatus === "loading"
          }
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {authStatus === "loading"
            ? "Updating..."
            : "Change Password"}
        </button>
      </form>
    </div>
  );
}