import React from 'react';
import { CarouselItem } from '../../models/carousel-item.interface';
import './Carousel.css';

interface CarouselProps {
  dataList: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = (props) => {
  const { dataList } = props;
  return (
    <div className="my-carousel">
      <div className="carousel-inner">
        {dataList.map((item: CarouselItem) => {
          return (
            <div key={new Date().getTime()}></div>
          )
        })}
      </div>
    </div>
  );
};

export default Carousel;
