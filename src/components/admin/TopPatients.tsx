
const topPatients = [
  { name: "Amrutha", patientId: "mre12345", total: 15 },
  { name: "Kevin", patientId: "mfh456", total: 11 },
  { name: "Vishnu", patientId: "mgh4569", total: 9 },
  { name: "Aravind", patientId: "kjl654", total: 6 },
  { name: "Manu", patientId: "asd5678", total: 5 },
];

export const TopPatients = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="mb-6">
        <p className="text-sm text-gray-500">Top Patients</p>
        <h3 className="text-xl font-semibold text-gray-900">See all</h3>
      </header>

      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Patient ID</th>
            <th className="px-4 py-3 text-right">Total appointments</th>
          </tr>
        </thead>
        <tbody>
          {topPatients.map((p, i) => (
            <tr key={p.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3 font-semibold">{p.name}</td>
              <td className="px-4 py-3">{p.patientId}</td>
              <td className="px-4 py-3 text-right font-semibold">{p.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
