import { useEffect, useState } from "react";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

interface ISliderProps {
    slides: any[];
}

export const Slider = ({slides}: ISliderProps) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [nextIndex, setNextIndex] = useState<number>(1);

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
        backgroundImage: `url(${slides[currentIndex]?.banner_image})`
    }

    const slideTwoStyle = {
        backgroundImage: `url(${slides[nextIndex]?.banner_image})`
    }

  return (
    <div className="h-[30vh] lg:h-[301px] md:h-full relative">
        <div className="relative h-full  w-full lg:w-[398px]">
            <div className="img-overlay z-20 rounded-lg"/>
            <div style={slideOneStyle} className={`w-full h-full rounded-lg bg-center bg-cover absolute top-0 right-10 z-10 `}></div>
            <div style={slideTwoStyle} className={`w-full h-[90%] my-auto rounded-lg bg-center bg-cover absolute top-3 right-0 z-0`}></div>
        </div>
        <div className="absolute bottom-2 md:left-3 w-[90%] text-start flex flex-col text-white z-20">
            <span className="font-semibold text-xs">
                {new Date(slides[currentIndex]?.published_at).toDateString()}
            </span>
            <h3 className="font-semibold text-base line-clamp-2">
                {slides[currentIndex]?.title}
            </h3>
            <div onClick={goToNext}>
                <HiOutlineArrowNarrowRight className="w-12 cursor-pointer" />
            </div>
        </div>
    </div>
  )
}
