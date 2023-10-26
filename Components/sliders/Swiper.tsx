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
      className='max-h-full h-full w-[50vw]'
    >
      {
        slides?.map((slide, index) => (
          <SwiperSlide
            key={index}
            className='rounded-md h-[40vh] bg-gray-400'
          >
            <img src={slide} alt='image' className='w-full h-[30vh] rounded-md object-cover object-center bg-gray-400'/>
          </SwiperSlide>
        ))
      }
    </Swiper>
  );
};

export default SwiperSlider