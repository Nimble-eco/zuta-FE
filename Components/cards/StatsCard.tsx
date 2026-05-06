import { LucideIcon } from "lucide-react";

interface IStatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  color?: "orange" | "blue" | "green" | "slate";
  trend?: string; // e.g., "+12% this week"
}

const StatsCard = ({ title, value, icon: Icon, color="orange", trend }: IStatsCardProps) => {
  const themes = {
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        {
          Icon ? (
            <div className={`p-3 rounded-xl border ${themes[color]}`}>
              <Icon size={24} />
            </div>
          ) : null
        }
        {trend && (
            <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded-full">
                {trend}
            </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;