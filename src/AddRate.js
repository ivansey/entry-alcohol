import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {Redirect} from "react-router-dom";
import {withRouter} from "react-router";


class AddRate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            response: null,
            cost: 0,
            description: "",
            warning: null,
        };

        this.handleCost = this.handleCost.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.add = this.add.bind(this);
        this.get = this.get.bind(this);
        this.checkCost = this.checkCost.bind(this);

        this.get();
    }

    handleCost = (e) => {
        this.setState({cost: e.target.value});
        this.checkCost();
    };

    handleDescription = (e) => {
        this.setState({description: e.target.value});
    };

    add = () => {
        axios.post("/api/v1/auto/rate/add", {
            token: cookies.load("token"),
            cost: this.state.cost,
            description: this.state.description,
            idAuto: this.props.match.params._id,
        }).then((res) => {
            this.setState({response: res.data.response, _id: res.data._id});
        });
    };

    get = () => {
        axios.post("/api/v1/auto/get", {_id: this.props.match.params._id}).then((data) => {
            this.setState({data: data.data.data});
        });
    };

    checkCost = () => {
        if (this.state.cost < this.state.data.cost) {
            this.setState({warning: "LOW_COST"});
        } else {
            this.setState({warning: null});
        }
    };

    render() {
        return <div className="page">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Добавление заявки</h2>
                    <br/>
                    <p>{this.state.data.model} - {this.state.data.cost} RUB</p>
                    <br/>
                    <form>
                        <div className="form-group">
                            <label htmlFor="cost">Цена</label>
                            <input type="number" className="form-control" placeholder="Цена" name="cost"
                                   onChange={this.handleCost}/>
                        </div>
                        {
                            this.state.warning === "LOW_COST"
                                ? <div className="alert alert-warning">Ваша цена ниже цены автомобиля</div>
                                : null
                        }
                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <textarea name="description" cols="30" rows="10" className="form-control"
                                      onChange={this.handleDescription}/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <button type="button" className="btn btn-primary" onClick={this.add}>Создание</button>
                        </div>
                        <div className="form-group">
                            {
                                this.state.response === "DONE"
                                    ?
                                    <div className="alert alert-success">Создано <Redirect
                                        to={"/auto/" + this.props.match.params._id}/></div>
                                    : null
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default withRouter(AddRate);