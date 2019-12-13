import React from "react";
import axios from "axios";
import {withRouter} from "react-router-dom";

class Index extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.location.search === "?login=done") {
            window.location.href = "/";
        }

        this.state = {
            list: [],
            response: "LOADING",
        };

        this.getList = this.getList.bind(this);
        this.returnList = this.returnList.bind(this);

        this.getList();
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
        return this.state.list.map((auto) => {
            return <div className="card" key={auto._id}>
                {
                    auto.image !== undefined
                        ? <img src={auto.image} alt={auto.model} className="card-img-top"/>
                        : null
                }
                <div className="card-body">
                    <p className="card-title">{auto.model} - {auto.cost} RUB</p>
                    <br/>
                    <ul className="list-unstyled">
                        <li>Производитель: {auto.vendor}</li>
                        <li>Цвет: {auto.color}</li>
                        <li>Годы производства: ({auto.yearOut}-{auto.yearIn})</li>
                        <li>Тип двигателя: {this.returnEngineType(auto.engineType)}</li>
                    </ul>
                    <button className="btn btn-primary" onClick={() => this.props.history.push("/auto/" + auto._id)}>Открыть</button>
                </div>
            </div>
        });
    };

    getList = () => {
        axios.post("/api/v1/auto/search", {search: ""}).then((data) => {
            this.setState({list: data.data.data});
        })
    };

    render() {
        return <div className="page">
            <h1>Список авто</h1>
            <button className="btn btn-primary" onClick={() => {this.props.history.push("/add")}}>Добавить авто</button>
            <br/>
            <div className="list">
                {this.returnList()}
            </div>
        </div>
    }
}

export default withRouter(Index);