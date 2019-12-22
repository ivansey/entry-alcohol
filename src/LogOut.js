import React from "react";
import cookies from "react-cookies";
import {withRouter} from "react-router";

class LogOut extends React.Component {
    constructor(props) {
        super(props);

        cookies.remove("token");

        this.props.history.push("/?login=done");
    }

    render() {
        return null;
    }
}

export default withRouter(LogOut);