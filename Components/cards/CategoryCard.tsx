import { useRouter } from 'next/router';

interface ICategoryCardProps {
  image?: string;
  title: string;
  emoji?: string;
}

const CategoryCard = ({ image, title, emoji }: ICategoryCardProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/results?tag=${encodeURIComponent(title)}`)}
      className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-slate-100 hover:border-orange-300 hover:shadow-sm transition-all duration-200 cursor-pointer group w-full"
    >
      {/* Icon / image */}
      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-orange-100 transition-colors">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <span className="text-2xl">{emoji ?? '📦'}</span>
        )}
      </div>

      {/* Label */}
      <span className="text-center text-[11px] font-medium text-slate-600 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
        {title}
      </span>
    </button>
  );
};

export default CategoryCard;