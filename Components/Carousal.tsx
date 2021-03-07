import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import Image from "next/image";

const Carousal = () => {
  SwiperCore.use([Navigation, Pagination, Autoplay]);
  return (
    <Swiper
      className="mb-4"
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      }}
    >
      <SwiperSlide>
        <Image
          src={"https://source.unsplash.com/1503x600"}
          width={1500}
          height={600}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src={"https://source.unsplash.com/1500x600"}
          width={1500}
          height={600}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src={"https://source.unsplash.com/1501x600"}
          width={1500}
          height={600}
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default Carousal;
