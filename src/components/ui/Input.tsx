// src/components/Input.tsx
import React from "react";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-3 py-2 w-full outline-teal-600 focus:ring-1 focus:ring-teal-600"
      />
    </div>
  );
};

export default Input;
