function CarouselItems({item,active}) {

  return (
<li className="carousel__slides shrink-0 w-full transition-all duration-300" style={{transform: `translateX(${-active * 100}%) `}}>
    <img src={item} alt="" className="w-full h-full object-cover" width={'100%'} />
</li>
  )
}

export default CarouselItems
