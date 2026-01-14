
const topDoctors = [
  { name: "Dr John Jackson", dept: "ENT specialist", score: 60 },
  { name: "Dr James Dalton", dept: "Dermatologist", score: 70 },
  { name: "Dr Sridevi", dept: "Gynecologist", score: 80 },
  { name: "Dr Krishnan", dept: "ENT specialist", score: 75 },
  { name: "Dr Niki Paul", dept: "Dermatologist", score: 30 },
];

export const TopDoctors = () => {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="mb-6">
        <p className="text-sm text-gray-500">Top rated doctors</p>
        <h3 className="text-xl font-semibold text-gray-900">See all</h3>
      </header>

      <div className="space-y-4">
        {topDoctors.map((doc) => (
          <div key={doc.name} className="rounded-xl border border-gray-100 p-4">
            <p className="font-semibold">{doc.name}</p>
            <p className="text-sm text-gray-500">{doc.dept}</p>
            <div className="mt-2 h-2 bg-gray-100 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${doc.score}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
