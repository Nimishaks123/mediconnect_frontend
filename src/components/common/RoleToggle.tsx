
interface Props {
    selectedRole: string;
    setSelectedRole: (role: string) => void;
  }
  
  export default function RoleToggle({ selectedRole, setSelectedRole }: Props) {
    return (
      <div className="flex gap-6 mb-6">
        {["DOCTOR", "PATIENT"].map((role) => (
          <button
            key={role}
            className={`pb-1 text-lg font-semibold border-b-2 ${
              selectedRole === role ? "border-sky-600 text-sky-700" : "border-transparent text-blue-200"
            }`}
            onClick={() => setSelectedRole(role)}
          >
            {role}
          </button>
        ))}
      </div>
    );
  }
  