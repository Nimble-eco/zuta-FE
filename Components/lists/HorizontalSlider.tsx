import { useRouter } from 'next/router';
import {MdArrowForward} from 'react-icons/md'

interface IHorizontalSliderProps {
    list_name: string;
    list: any[];
}

// Horizontal list of products
const HorizontalSlider = ({ list, list_name }: IHorizontalSliderProps) => {
    const router = useRouter();
    const goToProductPage = (id : string) => {
        router.push(`/product?id=${id}`);
    }
  return (
    <div className='flex flex-col overflow-x-scroll md:overflow-x-auto'>
        <div className='flex flex-row px-4 mb-4'>
            <h3 className='font-semibold text-2xl pr-3'>{list_name}</h3>
            <MdArrowForward className='text-4xl' />
        </div>
        <div className="flex flex-row overflow-x-auto">
            {
                list?.map((item, index) => (
                    <div className="flex flex-col bg-white rounded-md mb-8 shadow-xl mx-4 xs:min-w-[45%] min-w-[30%] md:min-w-[20%] lg:!min-w-[25%]" key={index}>
                        <img
                            src={item?.image}
                            alt={item?.name}
                            className='rounded-t-md justify-center h-48 cursor-pointer w-full'
                            onClick={() => goToProductPage(item?.id)}
                        />
                        <div className="flex flex-row justify-between px-3 py-2">
                            <h4 className="text-sm line-clamp-2">{item?.name}</h4>
                            <p className="">{item?.price}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default HorizontalSlider