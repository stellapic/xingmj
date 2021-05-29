import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { CarouselItem } from '../../models/carousel-item.interface';
import './Carousel.css';

interface CarouselProps {
  dataList: CarouselItem[];
}

const MyCarousel: React.FC<CarouselProps> = (props) => {
  const { dataList } = props;
  return (
    <div className="my-carousel">
      
      <Carousel dynamicHeight={false} width="100%" showThumbs={false} autoPlay={true} stopOnHover={false} interval={5000} transitionTime={800} infiniteLoop={true} showStatus={false}>
        {/* {dataList.map(eachData => {
          return (
            <a className="carousel-inner" href={eachData.redirect_url}>
              <img src={eachData.image} />
            </a>
          )
        })} */}
          {/* {dataList.map((info) => {
            return (
              <div className="carousel-inner">
                <img src="https://z3.ax1x.com/2021/05/28/2FsAi9.jpg" />
              </div>
            )
          })} */}
        <div className="carousel-inner">
          
        </div>
        <div className="carousel-inner">
          <img src="https://z3.ax1x.com/2021/05/28/2FsAi9.jpg" />
        </div>
        <div className="carousel-inner">
          <img src="https://z3.ax1x.com/2021/05/28/2FsAi9.jpg" />
        </div>
      </Carousel>
    </div>
 
  );
};

export default MyCarousel;
