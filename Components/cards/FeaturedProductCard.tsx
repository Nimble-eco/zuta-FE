import { useRouter } from 'next/router';
import { Sparkles, ArrowUpRight } from 'lucide-react'; 
import { formatAmount } from '../../Utils/formatAmount';
import { processImgUrl } from '../../Utils/helper';

interface IFeaturedProductComponentProps {
    product: any;
}

const FeaturedProductCard = ({ product }: IFeaturedProductComponentProps) => {
    const router = useRouter();
    const productData = product?.product; 

    const goToProductPage = () => {
        router.push(`/product?id=${product?.product_id}`);
    };

    return (
        <div
            onClick={goToProductPage}
            className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Featured Badge */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-orange-100">
                <Sparkles className="w-3 h-3 text-orange-500" fill="currentColor" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
                    Featured
                </span>
            </div>

            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                <img
                    src={processImgUrl(productData?.product_images[0])}
                    alt={product?.product_name || "product image"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Quick View Overlay (Mobile hidden, Desktop hover) */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white p-2 rounded-full shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform">
                        <ArrowUpRight className="w-5 h-5 text-gray-700" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col p-4">
                <div className="mb-2">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors capitalize">
                        {product?.product_name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-normal">
                        Featured Showcase
                    </p>
                </div>

                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">
                            {formatAmount(productData?.product_price)}
                        </span>
                        {productData?.product_discount > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400 line-through">
                                    {/* Logic to show original price if available */}
                                    {formatAmount(productData?.product_price * 1.2)} 
                                </span>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    {productData?.product_discount}% OFF
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Visual indicator for a button (optional) */}
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProductCard;