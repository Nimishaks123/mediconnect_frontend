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

export default function StatsCards({ stats }: Props) {
  const cards = [
    {
      title: "Today's Appointments",
      value: stats?.appointments ?? 0,
      subtitle: "Scheduled for today",
      icon: Calendar,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Wallet Balance",
      value: `₹${(stats?.walletBalance ?? 0).toLocaleString()}`,
      subtitle: "Available balance",
      icon: Wallet,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Unread Messages",
      value: stats?.unreadMessages ?? 0,
      subtitle: "Waiting for your response",
      icon: MessageCircle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Prescriptions",
      value: stats?.prescriptions ?? 0,
      subtitle: "Created this month",
      icon: FileText,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              px-5
              py-4
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-md
              hover:border-sky-200
            "
          >
            {/* Header */}

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                  {card.value}
                </h2>

              </div>

              <div
                className={`
                  w-12
                  h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  ${card.iconBg}
                `}
              >
                <Icon
                  className={`w-6 h-6 ${card.iconColor}`}
                />
              </div>

            </div>

            {/* Divider */}

            <div className="my-4 border-t border-gray-100" />

            {/* Footer */}

            <p className="text-sm text-gray-500">
              {card.subtitle}
            </p>

          </div>
        );
      })}
    </div>
  );
}