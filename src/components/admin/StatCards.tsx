
const statCards = [
  { label: "Doctors", value: 545, color: "bg-purple-100 text-purple-600" },
  { label: "Patients", value: 765, color: "bg-orange-100 text-orange-500" },
  { label: "Appointments", value: 80, color: "bg-amber-100 text-amber-500" },
];

export const StatCards = () => {
  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Statics
        </p>
        <p className="text-xs text-gray-400">Overall overview</p>
      </div>

      {statCards.map((card) => (
        <div key={card.label} className="rounded-2xl bg-white p-6 shadow-sm">
          <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-semibold ${card.color}`}>
            {card.label[0]}
          </div>
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-3xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </section>
  );
};
