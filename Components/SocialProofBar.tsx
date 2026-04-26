const stats = [
    { value: '12,400+', label: 'Active buyers' },
    { value: '₦1M+', label: 'Saved together' },
    { value: '98%', label: 'Satisfaction' },
  ];
  
const SocialProofBar = () => (
    <div className="flex justify-around items-center bg-white border-y border-slate-100 py-4 px-4">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center gap-0.5">
          <span className="text-lg font-bold text-orange-500">{stat.value}</span>
          <span className="text-[11px] text-slate-500">{stat.label}</span>
        </div>
      ))}
    </div>
);
  
export default SocialProofBar;