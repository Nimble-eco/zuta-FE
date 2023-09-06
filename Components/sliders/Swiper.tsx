// Import Swiper React components
import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
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
            className='rounded-md h-full'
          >
            <img src={slide} alt='image' className='w-full h-full rounded-md object-cover object-center'/>
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};

export default SwiperSlider