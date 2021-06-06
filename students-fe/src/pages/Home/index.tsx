import React, { useState, useEffect } from "react";
import { Input, Typography, Card } from "antd";
import HomeCarousel from "../../components/HomeCarousel";
import ImageCollection from "../../components/ImageCollection";

import { CarouselItem } from "../../models/carousel-item.interface";
import { apiListHomeSlides } from "../../request/api";

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
  }, []);

  if (!dataList || dataList.length === 0) {
    return null;
  }

  return (
    <>
      {/* 顶部轮播图模块 */}
      <div className={styles.homeBanner}>
        {/* 搜索框 */}
        <div className={styles.bannerContent}>
          {/* 主标题 */}
          <Title level={1} style={{ color: "#fff" }}>
            星美集
          </Title>
          {/* 次级标题 */}
          <Title level={3} style={{ marginBottom: "50px", marginTop: "20px", color: "#fff" }}>
            {dataList[currentIndex].text}
          </Title>
          {/* 搜索框 */}
          <Search
            placeholder="搜索关键词"
            size="large"
            allowClear
            enterButton="搜索"
            style={{ width: "80%" }}
          />
        </div>
        {/* 底部轮播图 */}
        <HomeCarousel indexChange={setCurrentIndex} dataList={dataList} />
      </div>
      {/* 页面主体内容 */}
      <Card className="mainContent">
        <ImageCollection />
      </Card>
    </>
  );
};

export default Home;
