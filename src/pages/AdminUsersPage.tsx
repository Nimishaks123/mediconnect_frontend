import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllUsers,
  blockUser,
  unblockUser,
} from "../store/admin/adminUserSlice";
import toast from "react-hot-toast";
import Header from "../components/layout/Header";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading, page, limit, total } = useAppSelector(
    (state) => state.adminUsers
  );

  /* -------------------- LOCAL STATE -------------------- */
  const [search, setSearch] = useState("");
  //const[isSearching,setIsSearch]=useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState<"ALL" | "ADMIN" | "DOCTOR" | "PATIENT">("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [confirmAction, setConfirmAction] = useState<{
  userId: string;
  type: "BLOCK" | "UNBLOCK";
} | null>(null);


  /* -------------------- DEBOUNCE SEARCH -------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* -------------------- FETCH USERS -------------------- */
  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page,
        limit,
        search: debouncedSearch,
        role: role === "ALL" ? "" : role,
        status: status === "ALL" ? "" : status,
      })
    );
  }, [dispatch, page, limit, debouncedSearch, role, status]);

  const totalPages = Math.ceil(total / limit);

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            All Users
          </h1>

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search name or email..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="px-3 py-2 border rounded-lg bg-white"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as typeof role)
              }
            >
              <option value="ALL">All Roles</option>
              {/* <option value="ADMIN">Admin</option> */}
              <option value="DOCTOR">Doctor</option>
              <option value="PATIENT">Patient</option>
            </select>

            <select
              className="px-3 py-2 border rounded-lg bg-white"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as typeof status)
              }
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-gray-600">
              Loading users…
            </div>
          ) : users.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">
              No users found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">
                      {u.name}
                    </td>

                    <td className="p-4 text-gray-600">
                      {u.email}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4">
                      {u.blocked ? (
                        <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-medium">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
                          Active
                        </span>
                      )}
                    </td>

                    {/* <td className="p-4 text-center">
                      {u.blocked ? (
                        <button
                          onClick={() => {
                            dispatch(unblockUser(u.id));
                            toast.success("User unblocked");
                          }}
                          className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            dispatch(blockUser(u.id));
                            toast.success("User blocked");
                          }}
                          className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                          Block
                        </button>
                      )}
                    </td> */}
                    <td className="p-4 text-center">
  {u.blocked ? (
    <button
      onClick={() =>
        setConfirmAction({ userId: u.id, type: "UNBLOCK" })
      }
      className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Unblock
    </button>
  ) : (
    <button
      onClick={() =>
        setConfirmAction({ userId: u.id, type: "BLOCK" })
      }
      className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Block
    </button>
  )}
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() =>
                  dispatch(
                    fetchAllUsers({
                      page: page - 1,
                      limit,
                      search: debouncedSearch,
                      role: role === "ALL" ? "" : role,
                      status: status === "ALL" ? "" : status,
                    })
                  )
                }
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Prev
              </button>

              <button
                disabled={page === totalPages}
                onClick={() =>
                  dispatch(
                    fetchAllUsers({
                      page: page + 1,
                      limit,
                      search: debouncedSearch,
                      role: role === "ALL" ? "" : role,
                      status: status === "ALL" ? "" : status,
                    })
                  )
                }
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* ================= CONFIRMATION MODAL ================= */}
{confirmAction && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Confirm Action
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to{" "}
        <span className="font-semibold">
          {confirmAction.type === "BLOCK" ? "block" : "unblock"}
        </span>{" "}
        this user?
      </p>

      <div className="flex justify-end gap-3">
        {/* CANCEL */}
        <button
          onClick={() => setConfirmAction(null)}
          className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        {/* CONFIRM */}
        <button
          onClick={async () => {
            try {
              if (confirmAction.type === "BLOCK") {
                await dispatch(
                  blockUser(confirmAction.userId)
                ).unwrap();
                toast.success("User blocked successfully");
              } else {
                await dispatch(
                  unblockUser(confirmAction.userId)
                ).unwrap();
                toast.success("User unblocked successfully");
              }
            } catch (error) {
              toast.error("Action failed. Please try again.");
            } finally {
              setConfirmAction(null);
            }
          }}
          className={`px-4 py-2 rounded text-white ${
            confirmAction.type === "BLOCK"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
