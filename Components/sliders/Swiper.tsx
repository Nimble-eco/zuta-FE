import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface ISwiperProps {
  slides: string[];
}

SwiperCore.use([Autoplay, Pagination]);

const SwiperSlider = ({slides}: ISwiperProps) => {
  return (
    <Swiper
      spaceBetween={10}
      grabCursor={true}
      slidesPerView={2}
      autoplay
      className='max-h-full h-full'
    >
      {
        slides?.map((slide, index) => (
          <SwiperSlide
            key={index}
            className='rounded-md bg-gray-400'
          >
            <img src={slide} alt='image' className='w-full rounded-md bg-gray-400'/>
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};

export default SwiperSlider