import { useRouter } from 'next/router';
import {MdArrowForward} from 'react-icons/md'
import { formatAmount } from '../../Utils/formatAmount';
import { processImgUrl } from '../../Utils/helper';

interface IHorizontalSliderProps {
    list_name: string;
    list: any[];
    page?: string
}

const HorizontalSlider = ({ list, list_name, page='/openOrder?id=' }: IHorizontalSliderProps) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`${page}${id}`);
    }
    
  return (
    <div className='flex flex-col w-full lg:min-w-[500px] overflow-x-scroll md:overflow-x-auto'>
        <div className='flex flex-row mb-4'>
            <h3 className='font-semibold text-xl pr-3'>{list_name}</h3>
            <MdArrowForward className='text-4xl' />
        </div>
        <div className="flex flex-row gap-4 overflow-x-auto">
            {
                list?.map((item, index) => (
                    <a 
                        href={`${page}${item?.id}`}
                        className="flex flex-col bg-white rounded-md shadow-xl xs:min-w-[45%] min-w-[30%] md:min-w-[20%] lg:!min-w-[20%]" 
                        key={index}
                    >
                        <img
                            src={processImgUrl(item?.product_images[0])}
                            alt={item?.product_name}
                            className='rounded-t-md justify-center h-48 cursor-pointer w-full'
                            onClick={() => goToProductPage(item?.id)}
                        />
                        <div className="flex flex-row justify-between px-2 py-2">
                            <h4 className="text-sm line-clamp-2 my-auto mr-4 capitalize">{item?.product_name}</h4>
                            <p className="text-green-500 font-medium">{formatAmount(item?.open_order_price)}</p>
                        </div>
                    </a>
                ))
            }
        </div>
    </div>
  )
}

export default HorizontalSlider