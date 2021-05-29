import React, { useState, useEffect } from "react";
import { Input, Typography } from "antd";
import HomeCarousel from "../../components/HomeCarousel";

import { CarouselItem } from "../../models/carousel-item.interface";
import styles from "./style.less";

const { Search } = Input;
const { Title } = Typography;

const defaultDataList: CarouselItem[] = [
  {
    image: "https://z3.ax1x.com/2021/05/28/2FsAi9.jpg",
    redirect_url: "http://xingmj.com",
    text: "Hello world0.",
  },
  {
    image: "https://z3.ax1x.com/2021/05/28/2FsAi9.jpg",
    redirect_url: "http://xingmj.com",
    text: "Hello world1.",
  },
  {
    image: "https://z3.ax1x.com/2021/05/28/2FsAi9.jpg",
    redirect_url: "http://xingmj.com",
    text: "Hello world2.",
  },
];

const Home: React.FC<{}> = () => {
  const [dataList, setDataList] = useState<CarouselItem[]>(defaultDataList);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  useEffect(() => {
    let timer = setTimeout(() => {
      setDataList((preValue) => {
        return [...preValue, preValue[0]];
      });
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <>
      {/* 轮播图 + 搜索框 */}
      <div className={styles.homeBanner}>
        <div className={styles.bannerContent}>
          <Title level={1}>星美集</Title>
          <Title level={3} style={{ marginBottom: "50px", marginTop: "20px" }}>{dataList[currentIndex].text}</Title>
          {/* 搜索框 */}
          <Search
            placeholder="搜索关键词"
            size="large"
            allowClear
            enterButton="搜索"
            style={{ width: "100%" }}
          />
        </div>
        {/* 底部轮播图 */}
        <HomeCarousel indexChange={setCurrentIndex} dataList={dataList} />
      </div>
    </>
  );
};

export default Home;
