interface DashboardCardProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export default function DashboardCard({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {actionLabel && (
          <button
            onClick={onAction}
            className="text-sky-600 text-sm font-medium hover:text-sky-700"
          >
            {actionLabel} →
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-6">
        {children}
      </div>
    </div>
  );
}