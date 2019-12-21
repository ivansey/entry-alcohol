import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {Redirect} from "react-router-dom";


class AddCar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            vendor: "",
            model: "",
            image: "",
            color: "",
            cost: 0,
            yearOut: 0,
            yearIn: 0,
            engineType: "petrol",
            response: null,
            imageResponse: null,
            _id: null
        };

        this.handleVendor = this.handleVendor.bind(this);
        this.handleModel = this.handleModel.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.handleCost = this.handleCost.bind(this);
        this.handleYearOut = this.handleYearOut.bind(this);
        this.handleYearIn = this.handleYearIn.bind(this);
        this.handleEngineType = this.handleEngineType.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.add = this.add.bind(this);
    }

    handleVendor = (e) => {
        this.setState({vendor: e.target.value});
    };

    handleModel = (e) => {
        this.setState({model: e.target.value});
    };

    handleColor = (e) => {
        this.setState({color: e.target.value});
    };

    handleCost = (e) => {
        this.setState({cost: e.target.value});
    };

    handleYearOut = (e) => {
        this.setState({yearOut: e.target.value});
    };

    handleYearIn = (e) => {
        this.setState({yearIn: e.target.value});
    };

    handleEngineType = (e) => {
        this.setState({engineType: e.target.value});
    };

    add = () => {
        axios.post("/api/v1/auto/add", {
            token: cookies.load("token"),
            vendor: this.state.vendor,
            model: this.state.model,
            image: this.state.image,
            color: this.state.color,
            cost: this.state.cost,
            yearOut: this.state.yearOut,
            yearIn: this.state.yearIn,
            engineType: this.state.engineType,
        }).then((res) => {
            this.setState({response: res.data.response, _id: res.data._id});
        });
    };

    image = {};

    handleUploadImage = (e) => {
        e.preventDefault();

        this.setState({imageResponse: "LOADING"})

        let data = new FormData();
        data.append("file", this.image.files[0]);
        data.append("filename", "image_" + Date.now() + ".jpg");

        axios.post("/api/v1/storage/image/upload", data).then((data) => {
            this.setState({image: data.data.url, imageResponse: data.data.response});
            console.log(data.data);
            console.log(this.state);
        });
    };

    render() {
        return <div className="page">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Добавление авто</h2>
                    <br/>
                    <form>
                        <div className="form-group">
                            <label htmlFor="vendor">Производитель</label>
                            <input type="text" className="form-control" placeholder="Производитель" name="vendor"
                                   onChange={this.handleVendor}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Модель</label>
                            <input type="text" className="form-control" placeholder="Модель" name="model"
                                   onChange={this.handleModel}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="color">Цвет</label>
                            <input type="text" className="form-control" placeholder="Цвет" name="color"
                                   onChange={this.handleColor}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Цена</label>
                            <input type="number" className="form-control" placeholder="Цена" name="cost"
                                   onChange={this.handleCost}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="yearOut">Год производства</label>
                            <input type="number" className="form-control" placeholder="Год" name="yearOut"
                                   onChange={this.handleYearOut}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="engineType">Тип двигателя</label>
                            <select className="form-control" name="engineType" onChange={this.handleEngineType}>
                                <option value="petrol" defaultChecked={true}>Бензин</option>
                                <option value="diesel">Дизель</option>
                                <option value="electro">Электро</option>
                            </select>
                        </div>
                        <div className="card">
                            <form onSubmit={this.handleUploadImage}>
                                <div className="card-body">
                                    <div className="form-group">
                                        <label htmlFor="photo">Фото</label>
                                        <input type="file" className="form-control-file" name="photo" ref={(ref) => {
                                            this.image = ref;
                                        }}/>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-group">
                                            {
                                                this.state.imageResponse === "LOADING"
                                                    ? <div className="alert alert-info">Загрузка...</div>
                                                    : null
                                            }
                                            {
                                                this.state.imageResponse === "OK"
                                                    ? <div className="alert alert-success">Загружено</div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-primary card-button-bottom">Загрузка фото</button>
                            </form>
                        </div>
                        <div className="form-group">
                            {
                                this.state.response === "DONE"
                                    ?
                                    <div className="alert alert-success">Создано <Redirect
                                        to={"/auto/" + this.state._id}/></div>
                                    : null
                            }
                        </div>
                    </form>
                </div>
                <button type="button" className="btn btn-primary card-button-bottom" onClick={this.add}>Создание</button>
            </div>
        </div>
    }
}

export default AddCar;