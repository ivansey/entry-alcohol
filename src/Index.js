import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {withRouter} from "react-router-dom";

class Index extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.location.search === "?login=done") {
            window.location.href = "/";
        }

        this.state = {
            list: [{}],
            response: "LOADING",
            userType: "GUEST",
            idUser: null,
        };

        this.getList = this.getList.bind(this);
        this.returnList = this.returnList.bind(this);
        this.getUserInfo = this.getUserInfo.bind(this);

        this.getList();
        this.getUserInfo();
    }

    returnEngineType = (type) => {
        if (type === "petrol") {
            return "Бензиновый";
        } else if (type === "diesel") {
            return "Дизельный";
        } else if (type === "electro") {
            return "Электрический";
        }
    };

    returnList = () => {
        if (this.state.list !== [{}]) {
            return this.state.list.map((auto) => {
                return <div className="card" key={auto._id}>
                    {
                        auto.image !== undefined
                            ? <img src={auto.image} alt={auto.model} className="card-img-top"/>
                            : null
                    }
                    <div className="card-body">
                        <p className="title">{auto.model}</p>
                        <ul className="list-unstyled">
                            <li>Производитель: {auto.vendor}</li>
                            <li>Цвет: {auto.color}</li>
                            <li>Годы производства: ({auto.yearOut}-{auto.yearIn})</li>
                            <li>Тип двигателя: {this.returnEngineType(auto.engineType)}</li>
                        </ul>
                        <p className="cost">{auto.cost} RUB</p>
                    </div>
                    <button className="btn btn-primary btn-block card-button-bottom"
                            onClick={() => this.props.history.push("/auto/" + auto._id)}>Открыть
                    </button>
                </div>
            });
        } else {
            return <div className="alert alert-info">Автомобили отсутствуют</div>
        }
    };

    getList = () => {
        axios.post("/api/v1/auto/search", {search: ""}).then((data) => {
            this.setState({list: data.data.data}, () => console.log(this.state));
        });
    };

    getUserInfo = () => {
        axios.post("/api/v1/users/auth/get", {token: cookies.load("token")}).then((data) => {
            if (data.data.response === "USER_FOUND") {
                this.setState({idUser: data.data.data._id, userType: data.data.data.type}, () => {
                    console.log(data.data);
                });
            }
        });
    };

    render() {
        return <div className="page">
            <h1>Список авто</h1>
            {
                this.state.userType === "ADMIN"
                    ? <button className="btn btn-primary btn-block" onClick={() => {this.props.history.push("/add")}}>Добавить авто</button>
                    : null
            }
            <br/>
            <div className="list">
                {this.returnList()}
            </div>
        </div>
    }
}

export default withRouter(Index);