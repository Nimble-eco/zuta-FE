import {Fade} from 'react-awesome-reveal'
import { useEffect, useState } from "react";
import { MdArrowForward } from 'react-icons/md';

interface IVerticalTextSliderProps {
    list: string[];
    list_name: string;
}

const VerticalTextSlider = ({ list, list_name }: IVerticalTextSliderProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const autoSlide = true;
    let slideInterval: any;
    let intervalTime = 5000;

    const goToNext = () => {
        const isLastSlide = currentIndex === list.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }

    const autoScroll = () => {
        slideInterval = setInterval(goToNext, intervalTime);
    }

    useEffect(() => {
        if(autoSlide) {
            autoScroll();
        }
        return () => clearInterval(slideInterval);
    }, [currentIndex]);

  return (
    <div className="h-fit bg-white rounded-md shadow-xl flex flex-col">
        <div className='flex flex-row px-3 mb-1'>
            <h3 className='font-semibold text-base pr-2 whitespace-nowrap'>{list_name}</h3>
            <MdArrowForward className='text-2xl' />
        </div>
        <Fade direction='up' duration={1500} className='' key={list[currentIndex]}>
            <p className='px-3 text-base mt-2'>{list[currentIndex]}</p>
        </Fade>
    </div>
  )
}

export default VerticalTextSlider