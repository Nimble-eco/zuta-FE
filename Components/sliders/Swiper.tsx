import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { processImgUrl } from '../../Utils/helper';

interface ISwiperProps {
  slides: string[];
  slidesToShow?: number;
  imageUrlSrc?: boolean;
}

SwiperCore.use([Autoplay, Pagination]);

const SwiperSlider = ({ slides, slidesToShow = 1, imageUrlSrc = true }: ISwiperProps) => {
  return (
    <Swiper
      spaceBetween={12}
      grabCursor
      slidesPerView={slidesToShow}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="h-full w-full rounded-2xl"
    >
      {slides?.map((slide, index) => (
        <SwiperSlide key={index} className="rounded-2xl overflow-hidden">
          <div className="relative w-full h-full min-h-[160px]">
            <img
              src={imageUrlSrc ? processImgUrl(slide) : slide}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />
            {/* Subtle gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperSlider;