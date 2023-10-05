/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Swiper , SwiperSlide} from 'swiper/react'
import 'swiper/css'
import { Navigation, Scrollbar, A11y,Keyboard,Zoom } from 'swiper/modules';

import 'swiper/swiper-bundle.css'


function SwiperMySlide({list,active}) {
  let  onEnter
  if(window.innerWidth < 900 ){
    onEnter = false 
  }else{
    onEnter = true
  }


    return (
    <Swiper
    modules={[Navigation, Scrollbar, A11y,Keyboard,Zoom]}
      spaceBetween={50}
      slidesPerView={1}
      zoom={true}
      navigation = {onEnter}
      keyboard={{enabled:true}}
      scrollbar={{draggable:true}}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      className={active ? 'enabledBtn ' : '' }
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