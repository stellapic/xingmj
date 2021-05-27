import React from "react";
// import { Col, Container, Row } from "reactstrap";
// import StudentList from "../../components/StudentList";
// import NewStudentModal from "../../components/NewStudentModal";
import Carousel from '../../components/Carousel/Carousel'

// import axios from "axios";

// import { API_URL } from "../../constants";

type resultDataTypeDef = {
	image: string,
	redirect_url: string,
	text: string
}

const Home: React.FC<{}> = () => {
	const dataList: resultDataTypeDef[] = [
		{
			image: "http://139.198.19.132/202105/13144135490341.jpg",
			redirect_url: "http://xingmj.com",
			text: "Hello world."
		},
	];

	return (
		<div id="home-page">
			<Carousel dataList={dataList} />
		</div>
	);
}

export default Home;
