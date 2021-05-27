import React, { Component, Fragment } from "react";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
// import Home from "./components/Home";

class App extends Component {
	render() {
		return (
			<Fragment>
				{/* 顶部 */}
				<Header />
				{/* 中间内容区域 */}
				<Content></Content>
				{/* 底部 */}
				<Footer></Footer>
			</Fragment>
		);
	}
}

export default App;
