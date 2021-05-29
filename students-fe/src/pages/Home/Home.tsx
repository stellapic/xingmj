import React from "react";
// import { Col, Container, Row } from "reactstrap";
// import StudentList from "../../components/StudentList";
// import NewStudentModal from "../../components/NewStudentModal";
import HomeCarousel from '../../components/HomeCarousel/HomeCarousel'

import { CarouselItem } from '../../models/carousel-item.interface';

// import axios from "axios";

// import { API_URL } from "../../constants";

const Home: React.FC<{}> = () => {
  const dataList: CarouselItem[] = [
    {
      image: "https://z3.ax1x.com/2021/05/28/2FsAi9.jpg",
      redirect_url: "http://xingmj.com",
      text: "Hello world."
    },
    {
      image: "https://z3.ax1x.com/2021/05/28/2FsAi9.jpg",
      redirect_url: "http://xingmj.com",
      text: "Hello world."
    },
    {
      image: "https://z3.ax1x.com/2021/05/28/2FsAi9.jpg",
      redirect_url: "http://xingmj.com",
      text: "Hello world."
    },
  ];

  return (
    <div id="home-page">
      <HomeCarousel dataList={dataList} />
    </div>
  );
}

export default Home;
