import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {Redirect} from "react-router-dom";


class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            pass: "",
            response: null
        };

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.login = this.login.bind(this);
    }

    handleEmail = (e) => {
        this.setState({email: e.target.value});
    };

    handlePass = (e) => {
        this.setState({pass: e.target.value});
    };

    login = () => {
        axios.post("/api/v1/users/login", {
            email: this.state.email,
            pass: this.state.pass
        }).then((res) => {
            this.setState({response: res.data.response});
            if (res.data.response === "DONE") {
                cookies.save("token", res.data.token, {
                    path: "/"
                });
            }
        });
    };

    render() {
        return <div className="page">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Вход</h2>
                    {/*<br/>*/}
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">EMail</label>
                            <input type="text" className="form-control" placeholder="Email" name="email" onChange={this.handleEmail}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Пароль</label>
                            <input type="password" className="form-control" placeholder="Пароль" name="password" onChange={this.handlePass}/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="button" onClick={this.login}>Вход</button>
                        </div>
                        {
                            this.state.response === "DONE"
                                ? <div className="alert alert-success">Вход выполнен <Redirect to="/?login=done"/></div>
                                : null
                        }
                        {
                            this.state.response === "USER_NOT_FOUND"
                                ? <div className="alert alert-danger">Пользователь не найден</div>
                                : null
                        }
                        {
                            this.state.response === "INVALID_PASSWORD"
                                ? <div className="alert alert-danger">Пароль не верен</div>
                                : null
                        }
                    </form>
                </div>
            </div>

        </div>
    }
}

export default Login;