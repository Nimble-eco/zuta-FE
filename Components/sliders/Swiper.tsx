import SwiperCore, { Autoplay, Pagination } from "swiper";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

interface ISwiperProps {
  slides: string[];
  slidesToShow?: number;
}

SwiperCore.use([Autoplay, Pagination]);

const SwiperSlider = ({slides, slidesToShow=1}: ISwiperProps) => {
  return (
    <Swiper
      spaceBetween={10}
      grabCursor={true}
      slidesPerView={slidesToShow}
      autoplay
      className='max-h-full h-full max-w-full overflow-auto'
    >
      {
        slides?.map((slide, index) => (
          <SwiperSlide
            key={index}
            className='rounded-md bg-gray-400'
          >
            <img src={slide} alt='image' className='w-full rounded-md bg-gray-400 object-cover'/>
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};

export default SwiperSlider