import { useRouter } from 'next/router';
import { FC } from 'react'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import RatingsCard from './RatingsCard';

interface IOpenOrderProductCardProps {
    product: {
        name: string,
        uuid: string;
        description?: string,
        image: string,
        price: number,
        discount?: number,
        rating?: number,
        openOrder?: {
            ordersCount: number,
            currentPrice: number,
            currentDiscount: number,
            user_id: string,
            created_at: string | Date,
        }
    }
}

const OpenOrderProductCard: FC<IOpenOrderProductCardProps> = ({product}) => {
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US')
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/openOrder?id=${id}`);
    }

    return (
        <div
            className='flex flex-col bg-white rounded-md mb-8 shadow-xl'
        >
            <div className='relative'>
                <div className='bg-white rounded-md text-center px-3 py-2 flex flex-row absolute top-2 left-2'>
                    <HiOutlineShoppingCart className='text-lg text-orange-300 mr-1 my-auto' />
                    <span className=''>200</span>
                </div>
                <img
                    src={product?.image}
                    alt="product image"
                    width={100}
                    height={200}
                    className='rounded-t-md justify-center mr-4 h-48 cursor-pointer w-full'
                    onClick={() => goToProductPage(product?.uuid)}
                />
            </div>
            <div 
                className="flex flex-col justify-between p-2 px-4 w-full"
            >
                <div className='flex flex-row justify-between mb-3'>
                    <h3 className='text-base font-mono line-clamp-1'>
                        {product?.name}
                    </h3>
                    { product.rating && <RatingsCard rating={product.rating} /> }
                </div>
                <p className='text-sm mb-3 text-slate-900'>
                    ${product.openOrder?.user_id} purchased about {timeAgo.format(new Date(product.openOrder?.created_at!))}
                </p>
                <div className='flex flex-row mb-4'>
                    <p className='text-xl text-orange-300 font-semibold mr-2'>
                        {product.openOrder?.currentPrice}
                    </p>
                    <p className='text-base font-thin line-through mr-2 my-auto'>
                        {product.price}
                    </p>
                    <span className='text-base my-auto'>
                        {product.openOrder?.currentDiscount}% Off
                    </span>
                </div>
            </div>
        </div>
    )
}

export default OpenOrderProductCard
