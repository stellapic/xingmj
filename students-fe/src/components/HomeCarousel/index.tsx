import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { CarouselItem } from "../../models/carousel-item.interface";

import styles from "./style.less";

interface HomeCarouselProps {
  dataList: CarouselItem[];
  indexChange: (currentIndex: number, Item: React.ReactNode) => void;
}

const HomeCarousel: React.FC<HomeCarouselProps> = (props) => {
  const { dataList, indexChange } = props;

  const children = dataList.map((item: CarouselItem) => {
    return (
      <a target="blank" className={styles.carouselInner} href={item.redirect_url} key={item.image}>
        <img src={item.image} alt={item.text} />
      </a>
    );
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
      onChange={indexChange}>
      {children}
    </Carousel>
  );
};

export default HomeCarousel;
