import {
  Calendar,
  Wallet,
  MessageCircle,
  FileText,
} from "lucide-react";

interface Props {
  stats?: {
    appointments: number;
    walletBalance: number;
    unreadMessages: number;
    prescriptions: number;
  };
}

const StatsCards = ({ stats }: Props) => {
  const cards = [
    {
      title: "Upcoming Appointments",
      value: stats?.appointments || 0,
      icon: Calendar,
      bg: "bg-blue-100",
    },
    {
      title: "Wallet Balance",
      value: `₹${stats?.walletBalance || 0}`,
      icon: Wallet,
      bg: "bg-cyan-100",
    },
    {
      title: "Unread Messages",
      value: stats?.unreadMessages || 0,
      icon: MessageCircle,
      bg: "bg-orange-100",
    },
    {
      title: "Active Prescriptions",
      value: stats?.prescriptions || 0,
      icon: FileText,
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`${card.bg} rounded-3xl p-6 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-4 text-gray-900">
                  {card.value}
                </h2>
              </div>

              <div className="bg-white p-3 rounded-2xl">
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;