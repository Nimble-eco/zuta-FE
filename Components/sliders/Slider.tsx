import { useEffect, useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

interface ISliderProps {
    slides: any[];
}

export const Slider = ({slides}: ISliderProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [nextIndex, setNextIndex] = useState<number>(1);
    const placeholderImg = 'https://dl.dropbox.com/s/gabwxlw971ijgov/shoeib-abolhassani-ukDEbYnyDsU-unsplash.jpg?dl=0';

    const autoSlide = true;
    let slideInterval: any;
    let intervalTime = 5000;

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
        setNextIndex(newIndex === slides.length - 1 ? 0 : newIndex + 1);
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

    const slideOneStyle = {
        backgroundImage: `url(${slides[currentIndex]?.banner_image} ?? ${placeholderImg})`
    }

    const slideTwoStyle = {
        backgroundImage: `url(${placeholderImg})`
    }

  return (
    <div className="h-full relative">
        <div className="relative h-full w-full">
            <div className="bg-black bg-opacity-60 absolute top-0 bottom-0 left-0 right-0 z-20 rounded-lg"/>
            <div style={slideOneStyle} className={`w-full h-full rounded-lg bg-center bg-cover absolute top-0 right-10 z-10 `}></div>
            <div style={slideTwoStyle} className={`w-full h-full my-auto rounded-lg bg-center bg-cover absolute right-0 z-0`}></div>
        </div>
        <div className="absolute top-12 md:top-1/2 right-3 w-[90%] text-start flex flex-col gap-2 text-white z-20">
            <h3 className="font-semibold text-2xl line-clamp-2">
                {slides[currentIndex]?.title}
            </h3>
            <span className="font-semibold text-sm text-orange-400">
                {slides[currentIndex]?.summary}
            </span>
            <div onClick={goToNext}>
                <HiOutlineArrowNarrowRight className="w-10 h-10 text-gray-200 cursor-pointer flex justify-self-end" />
            </div>
        </div>
    </div>
  )
}
