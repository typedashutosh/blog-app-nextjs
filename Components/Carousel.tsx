import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'
import Image from 'next/image'
import 'swiper/swiper.min.css'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.min.css'
import 'swiper/components/scrollbar/scrollbar.min.css'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles({
  slide: {}
})
const Carousal = () => {
  const classes = useStyles()
  SwiperCore.use([Navigation, Pagination, Autoplay])
  return (
    <Swiper
      className='mb-4'
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false
      }}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3
      }}
    >
      {[0, 1, 2, 3, 4].map((key) => (
        <SwiperSlide key={key}>
          <Image
            className={classes.slide}
            src={'https://source.unsplash.com/1500x400'}
            height={400}
            width={1500}
            layout='responsive'
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Carousal
