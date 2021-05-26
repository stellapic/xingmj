import React, { Component, Fragment } from "react";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
// import Home from "./components/Home";

class App extends Component {
	render() {
		return (
			<Fragment>
				<Header />
				<Content></Content>
				{/* <Home /> */}
			</Fragment>
		);
	}
}

export default App;
