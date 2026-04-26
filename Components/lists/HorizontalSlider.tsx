import { useRouter } from 'next/router';
import { ArrowRight } from 'lucide-react';
import { formatAmount } from '../../Utils/formatAmount';
import { processImgUrl } from '../../Utils/helper';

interface IHorizontalSliderProps {
  list_name: string;
  list: any[];
  page?: string;
}

const HorizontalSlider = ({ list, list_name, page = '/openOrder?id=' }: IHorizontalSliderProps) => {
  const router = useRouter();

  if (!list?.length) return null;

  return (
    <section className="flex flex-col w-full py-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3 px-0">
        <h3 className="font-semibold text-slate-800 text-base">{list_name}</h3>
        <button className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
          View all <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable row */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {list.map((item, index) => (
          <article
            key={index}
            onClick={() => router.push(`${page}${item?.id}`)}
            className="flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 cursor-pointer shrink-0 w-[140px] overflow-hidden"
          >
            {/* Image */}
            <div className="h-[110px] w-full bg-slate-100 overflow-hidden">
              <img
                src={processImgUrl(item?.product_images?.[0])}
                alt={item?.product_name}
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="px-2.5 py-2 flex flex-col gap-0.5">
              <p className="text-[12px] font-medium text-slate-700 line-clamp-2 leading-snug capitalize">
                {item?.product_name}
              </p>
              <p className="text-[13px] font-semibold text-green-600 mt-0.5">
                {formatAmount(item?.open_order_price ?? item?.product_price)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HorizontalSlider;