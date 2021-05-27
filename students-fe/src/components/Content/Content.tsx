import React from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import Home from '../../pages/Home/Home';

const Content: React.FC<RouteComponentProps> = () => {
  return (
    <div id="content">
      <Home></Home>
    </div>
  );
}
export default withRouter(Content);
