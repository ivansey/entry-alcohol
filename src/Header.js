import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {withRouter} from "react-router-dom";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                response: "LOADING",
                email: "",
            },
        };

        this.getInfoUser = this.getInfoUser.bind(this);

        this.getInfoUser();
    }

    getInfoUser = () => {
        if (cookies.load("token") !== undefined) {
            axios.post("/api/v1/users/auth/get", {token: cookies.load("token")}).then((data) => {
                if (data.data.response === "NOT_ACCESS") {
                    this.setState({user: {response: "NONE"}});
                } else {
                    this.setState({user: {response: "OK", email: data.data.data.email}});
                }
            })
        } else {
            this.setState({user: {response: "NONE"}});
        }
    };

    render() {
        return <div className="header">
            <p className="title" onClick={() => this.props.history.push("/")}>Header</p>
            <div className="user">
                <p className="email">{this.state.user.email}</p>
                {
                    this.state.user.response === "OK"
                        ? <div>
                            <p className="btn btn-link btn-sm" onClick={() => this.props.history.push("/profile")}><span className="mdi mdi-account"/></p>
                            <p className="btn btn-link btn-sm" onClick={() => this.props.history.push("/logout")}><span className="mdi mdi-logout"/></p>
                        </div>
                        : <div>
                            <p className="btn btn-link btn-sm" onClick={() => this.props.history.push("/reg")}><span className="mdi mdi-account-plus"/></p>
                            <p className="btn btn-link btn-sm" onClick={() => this.props.history.push("/login")}><span className="mdi mdi-login"/></p>
                        </div>
                }
            </div>
        </div>
    }
}

export default withRouter(Header);