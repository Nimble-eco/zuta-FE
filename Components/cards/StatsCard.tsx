interface IStatsCardProps {
  title: string;
  footer?: string;
  value: string | number;
}

const StatsCard = ({title, value, footer}: IStatsCardProps) => {
  return (
    <div className="flex flex-col rounded-md shadow-lg bg-white px-4 py-2 text-left">
      <p className="font-medium text-slate-600 capitalize">{title}</p>
      <p className="font-semibold text-slate-600 text-xl">{value}</p>
      {
        footer && <div className="border-t border-gray-200 py-1 font-semibold text-sm text-slate-400">
          {footer}
        </div>
      }
    </div>
  )
}

export default StatsCard