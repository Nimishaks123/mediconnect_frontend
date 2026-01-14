import { MagnifyingGlassIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../store/hooks";

const DashboardHeader = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm text-gray-500">
          Welcome back {user?.name ?? "User"}!
        </p>
        <h1 className="text-3xl font-semibold">Appointment List</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
          <MagnifyingGlassIcon className="mr-2 h-4 w-4 text-gray-400" />
          <input
            className="w-40 bg-transparent text-sm outline-none"
            placeholder="Search doctors"
          />
        </div>

        <button className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
          <CalendarDaysIcon className="mr-1 inline h-4 w-4 text-gray-500" />
          Filter
        </button>

        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm">
          + Make New Appointment
        </button>
      </div>
    </section>
  );
};

export default DashboardHeader;
