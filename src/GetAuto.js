import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {Redirect, withRouter} from "react-router";
import Modal from "react-modal";

class GetAuto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            response: "LOADING",
            statusUser: "GUEST",
            idUser: "",
            modalDeleteOpen: false,
            rateList: [],
        };

        this.get = this.get.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.delete = this.delete.bind(this);
        this.returnRateList = this.returnRateList.bind(this);
        this.getRateList = this.getRateList.bind(this);

        this.get();
        this.getRateList();
    }

    get = () => {
        axios.post("/api/v1/auto/get", {_id: this.props.match.params._id}).then((data) => {
            this.setState({data: data.data.data, response: data.data.response}, () => {
                this.checkToken();
            });
        });
    };

    delete = () => {
        axios.post("/api/v1/auto/delete", {_id: this.props.match.params._id, token: cookies.load("token")}).then((data) => {
            if (data.data.response === "DONE") {
                this.setState({response: "DELETED"});
            }
        });
    };

    checkToken = () => {
        axios.post("/api/v1/users/checkToken", {token: cookies.load("token")}).then((data) => {
            if (data.data.response === "CHECK_TOKEN_DONE") {
                this.setState({idUser: data.data._id});
                if (this.state.data.idUser === data.data._id) {
                    this.setState({statusUser: "AUTHOR"});
                } else {
                    this.setState({statusUser: "USER"});
                }
            }
        });
    };

    returnEngineType = (type) => {
        if (type === "petrol") {
            return "Бензиновый";
        } else if (type === "diesel") {
            return "Дизельный";
        } else if (type === "electro") {
            return "Электрический";
        }
    };

    modalProperty = {
        content: {
            top: "50%",
            left: "calc(50% - 125px)",
            right: "auto",
            bottom: "auto",
            width: "250px",
            display: "flex",
            justifyContent: "center",
        }
    };


    openModal = () => {
        this.setState({modalDeleteOpen: true});
    };

    closeModal = () => {
        this.setState({modalDeleteOpen: false});
    };

    returnRateList = () => {
        if (this.state.rateList !== []) {
            return this.state.rateList.map((rate) => {
                return <div className="rate-card" key={rate._id}>
                    <div className="card-body">
                        <p className="card-title">
                            {rate.cost} RUB
                            <div className="btn-group">
                                {
                                    rate.idUser === this.state.idUser
                                        ? <button className="btn btn-danger btn-block btn-sm">Удаление</button>
                                        : null
                                }
                                {
                                    this.state.statusUser === "AUTHOR"
                                        ? <button className="btn btn-primary btn-block btn-sm">Принять ставку</button>
                                        : null
                                }
                            </div>
                        </p>
                        <div>
                            {rate.description}
                        </div>
                    </div>
                </div>
            });
        } else {
            return <div className="alert alert-info">Ставок нет</div>;
        }
    };

    getRateList = () => {
        axios.post("/api/v1/auto/rate/get", {_id: this.props.match.params._id}).then((data) => {
            if (data.data.data !== []) {
                this.setState({rateList: data.data.data});
                console.log(this.state.rateList);
            }
        })
    };

    render() {
        return <div className="page">
            <Modal
                isOpen={this.state.modalDeleteOpen}
                onRequestClose={this.closeModal}
                style={this.modalProperty}
                contentLabel="Подверждение удаления"
            >
                <button className="btn btn-danger btn-block" onClick={this.delete}>Подтвердаю удаление</button>
            </Modal>
            <div className="auto-card-page">
                <div className="title-bar">
                    <p className="title">{this.state.data.model}</p>
                    <p className="cost">{this.state.data.cost} RUB</p>
                </div>
                <div className="btn-group" role="group" aria-label="Действия">
                    {
                        this.state.statusUser === "USER"
                            ? <button className="btn btn-primary" onClick={() => {this.props.history.push("/auto/" + this.state.data._id + "/rate/add")}}>Оставить ставку</button>
                            : null
                    }
                    {
                        this.state.statusUser === "AUTHOR"
                            ? <button className="btn btn-primary" onClick={() => {this.props.history.push("/auto/" + this.state.data._id + "/edit")}}>Редактировать</button>
                            : null
                    }
                    {
                        this.state.statusUser === "AUTHOR"
                            ? <button className="btn btn-danger" onClick={this.openModal}>Удалить</button>
                            : null
                    }
                </div>
                <div className="card-body">
                    <div className="info">
                        <dl className="dl-horizontal">
                            <dt>Производитель</dt>
                            <dd>{this.state.data.vendor}</dd>
                            <dt>Цвет</dt>
                            <dd>{this.state.data.color}</dd>
                            <dt>Годы производства</dt>
                            <dd>{this.state.data.yearOut} - {this.state.data.yearIn}</dd>
                            <dt>Тип двигателя</dt>
                            <dd>{this.returnEngineType(this.state.data.engineType)}</dd>
                        </dl>
                    </div>
                    {
                        this.state.data.image !== undefined
                            ? <img src={this.state.data.image} alt={this.state.data.model} className="card-img-top"/>
                            : null
                    }
                </div>
            </div>
            <br/>
            <div className="rates">
                <h3 className="title">Ставки</h3>
                {this.returnRateList()}
            </div>
            {
                this.state.response === "DELETED"
                    ? <Redirect to="/"/>
                    : null
            }
        </div>
    }
}

export default withRouter(GetAuto);