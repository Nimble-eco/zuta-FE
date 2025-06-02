import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { processImgUrl } from "../../Utils/helper";

interface ISwiperProps {
  slides: string[];
  slidesToShow?: number;
  imageUrlSrc?: boolean;
}

SwiperCore.use([Autoplay, Pagination]);

const SwiperSlider = ({slides, slidesToShow=1, imageUrlSrc=true}: ISwiperProps) => {
  return (
    <Swiper
      spaceBetween={10}
      grabCursor={true}
      slidesPerView={slidesToShow}
      autoplay
      className='h-full w-full'
    >
      {
        slides?.map((slide, index) => (
          <SwiperSlide
            key={index}
            className={`rounded-md bg-gray-400 max-h-full min-h-full`}
          >
            <img 
              src={imageUrlSrc ? processImgUrl(slide) : slide} 
              alt='image' 
              className='min-w-full min-h-full max-h-full rounded-md bg-gray-400 !object-center !object-cover'
            />
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};

export default SwiperSlider