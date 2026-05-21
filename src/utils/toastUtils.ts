import toast from "react-hot-toast";

// Centralized Toast 

export const showSuccess = (message: string, id?: string) => {
  toast.success(message, { id });
};

export const showError = (message: string, id?: string) => {
  toast.error(message, { id });
};

export const showInfo = (message: string, id?: string) => {
  toast(message, { id, icon: 'ℹ️' });
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (id?: string) => {
  toast.dismiss(id);
};
