import React from "react";
// import { Col, Container, Row } from "reactstrap";
// import StudentList from "../../components/StudentList";
// import NewStudentModal from "../../components/NewStudentModal";
import MyCarousel from '../../components/Carousel/Carousel'

import { CarouselItem } from '../../models/carousel-item.interface';

// import axios from "axios";

// import { API_URL } from "../../constants";

const Home: React.FC<{}> = () => {
	const dataList: CarouselItem[] = [
		{
			image: "http://139.198.19.132/202105/13144135490341.jpg",
			redirect_url: "http://xingmj.com",
			text: "Hello world."
		},
	];

	return (
		<div id="home-page">
			{/* <Carousel dataList={dataList} /> */}
			<MyCarousel dataList={dataList}></MyCarousel>
		</div>
	);
}

export default Home;
