import React, { Component } from "react";
// import { Col, Container, Row } from "reactstrap";
// import StudentList from "../../components/StudentList";
// import NewStudentModal from "../../components/NewStudentModal";
import Carousel from '../../components/Carousel/Carousel'

// import axios from "axios";

// import { API_URL } from "../../constants";

type statesType = {
	students: number[],
	dataList: resultDataTypeDef[]
}
type resultDataTypeDef = {
	image: string,
	redirect_url: string,
	text: string
}

class Home extends Component {
	state: statesType = {
		students: [1, 2, 3, 4],
		dataList: [
			{
				image: "http://139.198.19.132/202105/13144135490341.jpg",
				redirect_url: "http://xingmj.com",
				text: "Hello world."
			}
		]
	};

	render() {
		const { dataList } = this.state;
		return (
			<div id="home-page">
				<Carousel dataList={dataList}></Carousel>
			</div>
		);
	}
}

export default Home;
