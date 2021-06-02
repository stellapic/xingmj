import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Home from "../../pages/Home";
import Login from "../Login";
import Register from "../Register";

const Content: React.FC<RouteComponentProps> = () => {
  return (
    <div id="content">
      <Home></Home>
      {/* 登录遮罩 */}
      <Login isActive={false}></Login>
      <Register isActive={false}></Register>
    </div>
  );
};
export default withRouter(Content);
