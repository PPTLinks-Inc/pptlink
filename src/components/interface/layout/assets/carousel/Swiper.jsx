/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Swiper , SwiperSlide} from 'swiper/react'
import 'swiper/css'
import { Navigation, Pagination, Scrollbar, A11y,Keyboard,Zoom } from 'swiper/modules';

import 'swiper/swiper-bundle.css'


function SwiperMySlide({list}) {

    list.forEach((item,index)=>{
        console.log(item)
    })

    return (
    <Swiper
    modules={[Navigation, Pagination, Scrollbar, A11y,Keyboard]}
      spaceBetween={50}
      slidesPerView={1}
      Zoom={true}
      navigation
      keyboard={{enabled:true}}
      pagination={{clickable:true}}
      scrollbar={{draggable:true}}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {list.map((slide,index) =>{
      return  <SwiperSlide key={index}>
            <img src={slide} alt="" className='object-contain w-full h-full' />
        </SwiperSlide>
      })}
     
    
    </Swiper>
  )
}

export default SwiperMySlide