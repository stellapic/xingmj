import React from "react";
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from "react-router-dom";
import Home from "../../pages/Home";
import Collections from "../../pages/Collections";
import Detail from "../../pages/Detail";

const Content: React.FC<RouteComponentProps> = () => {
  return (
    <div id="content">
      <Switch>
        <Route path="/collections">
          <Collections></Collections>
        </Route>
        <Route path="/detail">
          <Detail></Detail>
        </Route>
        <Route path="/home">
          <Home></Home>
        </Route>
        <Redirect from="/*" to="/home"></Redirect>
      </Switch>
    </div>
  );
};
export default withRouter(Content);
