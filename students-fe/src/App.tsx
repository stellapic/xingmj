import React, { Component, Fragment } from "react";
import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";
import "antd/dist/antd.css";
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
