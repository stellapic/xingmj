import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from "react-router-dom";
import Home from '../../pages/Home/Home';

class Content extends Component<RouteComponentProps> {
    render() {
        return (
            <div id="content">
                <Home></Home>
            </div>
        )
    }
}
export default withRouter(Content)
