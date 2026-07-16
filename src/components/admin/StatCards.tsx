import type{ LucideIcon } from "lucide-react";

export interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface Props {
  cards: StatCard[];
}

export const StatCards = ({ cards }: Props) => {
  return (
    <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-gray-900">
                  {card.value}
                </h2>
              </div>

              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>

            </div>
          </div>
        );
      })}
    </section>
  );
};