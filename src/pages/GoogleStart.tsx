import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function GoogleStart() {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get("role") || "patient";
    window.location.href = `http://localhost:4000/api/auth/google?role=${role}`;
  }, [location.search]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-700 text-lg">Connecting securely to Google...</p>
      </div>
    </div>
  );
}
