import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {Redirect} from "react-router-dom";


class Reg extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            pass: "",
            response: null
        };

        this.handleEmail = this.handleEmail.bind(this);
        this.handlePass = this.handlePass.bind(this);
        this.reg = this.reg.bind(this);
    }

    handleEmail = (e) => {
        this.setState({email: e.target.value});
    };

    handlePass = (e) => {
        this.setState({pass: e.target.value});
    };

    reg = () => {
        axios.post("/api/v1/users/reg", {
            email: this.state.email,
            pass: this.state.pass
        }).then((res) => {
            this.setState({response: res.data.response});
            if (res.data.response === "DONE") {

            }
        });
    };

    render() {
        return <div className="page">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Регистрация</h2>
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
                            <button className="btn btn-primary" type="button" onClick={this.reg}>Регистрация</button>
                        </div>
                        {
                            this.state.response === "DONE"
                                ? <div className="alert alert-success">Регистрация выполнена <Redirect to="/login"/></div>
                                : null
                        }
                        {
                            this.state.response === "EMAIL_NOT_FREE"
                                ? <div className="alert alert-danger">Email не свободен</div>
                                : null
                        }
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Reg;