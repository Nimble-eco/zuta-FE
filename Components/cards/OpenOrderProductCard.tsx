import { useRouter } from 'next/router';
import { FC } from 'react'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import RatingsCard from './RatingsCard';
import { formatAmount } from '../../Utils/formatAmount';
import { processImgUrl } from '../../Utils/helper';

interface IOpenOrderProductCardProps {
    order: {
        id: string,
        open_order_price: number,
        open_order_discount: number,
        user_id: string,
        created_at: string | Date,
        subscribers_count: number,
        product: {
            product_name: string,
            product_id: string;
            product_description?: string,
            product_images: string[],
            product_price: number,
            product_discount?: number,
            reviews?: number,
        },
        subscribers_list: any[]
    }
}

const OpenOrderProductCard: FC<IOpenOrderProductCardProps> = ({order}) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/openOrder?id=${id}`);
    }

    return (
        <div
            className='flex flex-col bg-slate-800 rounded-md mb-8 shadow-xl'
        >
            <div className='relative'>
                <div className='bg-white rounded-md text-center px-2 py-1 flex flex-row items-center absolute top-2 left-2'>
                    <HiOutlineShoppingCart className='text-base text-orange-500 mr-1' />
                    <span className='text-orange-500 font-medium text-sm'>{order?.subscribers_count ?? 0}</span>
                </div>
                <img
                    src={processImgUrl(order.product?.product_images[0])}
                    alt="product image"
                    className='rounded-t-md h-40 cursor-pointer w-full object-cover object-center'
                    onClick={()=>goToProductPage(order.id)}
                />
            </div>
            <div 
                className="flex flex-col gap-2 px-2 py-2 w-full"
            >
                <div className='flex flex-row justify-between items-center gap-1'>
                    <h3 className='text-sm line-clamp-2 text-white capitalize'>
                        {order.product?.product_name}
                    </h3>
                    <p className='text-sm text-green-600 font-semibold !mb-0'>
                        {formatAmount(order?.open_order_price)}
                    </p>
                </div>
                <div className='flex flex-row justify-between items-center gap-2'>
                    <RatingsCard 
                        rating={order.product.reviews ?? 4} 
                        hight={3}
                        width={3}
                    />
                    <div className='flex flex-row gap-2 items-center font-medium text-gray-300'>
                        <p className='text-xs font-thin line-through !mb-0'>
                            {formatAmount(order.product?.product_price)}
                        </p>
                        <span className='text-xs !mb-0'>
                            {order?.open_order_discount}% Off
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpenOrderProductCard
