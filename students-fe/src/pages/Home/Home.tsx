import React, { Component } from "react";
// import { Col, Container, Row } from "reactstrap";
// import StudentList from "../../components/StudentList";
// import NewStudentModal from "../../components/NewStudentModal";
import Carousel from '../../components/Carousel/Carousel'

// import axios from "axios";

// import { API_URL } from "../../constants";

type statesType = {
	students: number[],
	dataList: Object[]
}


class Home extends Component {
	state: statesType = {
		students: [1, 2, 3, 4],
		dataList: [
			{}
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
