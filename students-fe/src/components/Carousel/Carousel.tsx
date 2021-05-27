import React from 'react';
import './Carousel.css';

interface CarouselProps {
  dataList: Object[]
}

const Carousel: React.FC<CarouselProps> = (props) => {
  const { dataList } = props;
  return (
    <div className="my-carousel">
      <div className="carousel-inner">
        {dataList.map((info) => {
          return (
            <div key={new Date().getTime()}></div>
          )
        })}
      </div>
    </div>
  );
};

export default Carousel;
