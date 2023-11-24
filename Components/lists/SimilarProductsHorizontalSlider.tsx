import { useRouter } from 'next/router';
import {MdArrowForward} from 'react-icons/md'
import { formatAmount } from '../../Utils/formatAmount';

interface IHorizontalSliderProps {
    list_name: string;
    list: any[];
}

// Horizontal list of open order products
const SimilarProductsHorizontalSlider = ({ list, list_name }: IHorizontalSliderProps) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/product?id=${id}`);
    }
  return (
    <div className='flex flex-col min-w-[500px] overflow-x-scroll md:overflow-x-auto'>
        <div className='flex flex-row px-4 mb-4'>
            <h3 className='font-semibold text-2xl pr-3'>{list_name}</h3>
            <MdArrowForward className='text-4xl' />
        </div>
        <div className="flex flex-row overflow-x-auto">
            {
                list?.map((item, index) => (
                    <div className="flex flex-col bg-white rounded-md mb-8 shadow-xl mx-4 xs:min-w-[45%] min-w-[30%] md:min-w-[20%] lg:!min-w-[20%]" key={index}>
                        <img
                            src={item?.product_images[0]}
                            alt={item?.product_name}
                            className='rounded-t-md justify-center h-48 cursor-pointer w-full'
                            onClick={() => goToProductPage(item?.id)}
                        />
                        <div className="flex flex-row justify-between px-2 py-2">
                            <h4 className="text-sm line-clamp-2 my-auto mr-4">{item?.product_name}</h4>
                            <p className="text-green-500 font-medium">{formatAmount(item?.product_price)}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default SimilarProductsHorizontalSlider