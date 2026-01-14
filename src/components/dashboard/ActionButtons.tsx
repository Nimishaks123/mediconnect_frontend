// type ActionItem = {
//   label: string;
//   active?: boolean;
//   icon?: React.ReactNode;
// };

// const ActionButtons = ({ actions }: { actions: ActionItem[] }) => {
//     return (
//       <section className="mb-6 flex flex-wrap gap-3">
//         {actions.map((action) => (
//           <button
//             key={action.label}
//             className={`flex flex-1 min-w-[140px] items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${
//               action.active
//                 ? "bg-blue-600 text-white shadow-md"
//                 : "bg-white text-gray-600 shadow-sm hover:bg-blue-50"
//             }`}
//           >
//             <span className="mr-2 text-lg">{action.icon}</span>
//             {action.label}
//           </button>
//         ))}
//       </section>
//     );
//   };
  
//   export default ActionButtons;
  import { useNavigate } from "react-router-dom";

type Action = {
  label: string;
  icon: string;
  active?: boolean;
};

type Props = {
  actions: Action[];
};

const ActionButtons = ({ actions }: Props) => {
  const navigate = useNavigate();

  const handleClick = (label: string) => {
    if (label === "Find Doctor") {
      navigate("/doctors");
    }
    if (label === "Appointments") {
      navigate("/appointments");
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => handleClick(action.label)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            action.active
              ? "bg-mediconnect-teal text-black"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {action.icon} {action.label}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
