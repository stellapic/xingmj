import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { CarouselItem } from '../../models/carousel-item.interface';

import styles from './style.less';

interface HomeCarouselProps {
  dataList: CarouselItem[];
}

const HomeCarousel: React.FC<HomeCarouselProps> = (props) => {
  const { dataList } = props;

  const children = dataList.map((item: CarouselItem) => {
    return (
      <a className={styles.carouselInner} href={item.redirect_url}>
        <img src={item.image} />
      </a>
    )
  });

  return (      
    <Carousel
      dynamicHeight={false}
      width="100%"
      showThumbs={false}
      autoPlay
      stopOnHover={false}
      interval={5000}
      transitionTime={800}
      infiniteLoop
      showStatus={false}
    >
      {children}
    </Carousel> 
  );
};

export default HomeCarousel;
