import React, { useState, useEffect } from "react";
import { Input, Typography } from "antd";
import HomeCarousel from "../../components/HomeCarousel";

import { CarouselItem } from "../../models/carousel-item.interface";
import { apiListHomeSlides } from '../../request/api';

import styles from "./style.less";

const { Search } = Input;
const { Title } = Typography;

const Home: React.FC<{}> = () => {
  const [dataList, setDataList] = useState<CarouselItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  useEffect(() => {
    apiListHomeSlides().then((res) => {
      setDataList(res.data);
    });
    let timer = setTimeout(() => {
      setDataList((preValue) => {
        return [...preValue, preValue[0]];
      });
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!dataList || dataList.length === 0) {
    return null;
  }

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
