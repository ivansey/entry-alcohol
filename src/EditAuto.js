import React from "react";
import axios from "axios";
import cookies from "react-cookies";
import {Redirect} from "react-router-dom";


class EditAuto extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            model: "",
            image: "",
            color: "",
            cost: 0,
            yearOut: 0,
            yearIn: 0,
            response: null,
            imageResponse: null,
            _id: null,
            data: {},
        };

        this.handleModel = this.handleModel.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.handleCost = this.handleCost.bind(this);
        this.handleYearOut = this.handleYearOut.bind(this);
        this.handleYearIn = this.handleYearIn.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.get = this.get.bind(this);
        this.edit = this.edit.bind(this);

        this.get();
    }

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

    get = () => {
        axios.post("/api/v1/auto/get", {_id: this.props.match.params._id, token: cookies.load("token")}).then((data) => {
            this.setState({
                data: data.data.data,
                image: data.data.data.image,
                model: data.data.data.model,
                color: data.data.data.color,
                cost: data.data.data.cost,
                yearOut: data.data.data.yearOut,
                yearIn: data.data.data.yearIn,
            });
        });
    };

    edit = () => {
        axios.post("/api/v1/auto/edit", {
            token: cookies.load("token"),
            model: this.state.model,
            image: this.state.image,
            color: this.state.color,
            cost: this.state.cost,
            yearOut: this.state.yearOut,
            yearIn: this.state.yearIn,
        }).then((res) => {
            this.setState({response: res.data.response, _id: res.data._id});
        });
    };

    image = {};

    handleUploadImage = (e) => {
        e.preventDefault();

        this.setState({imageResponse: "LOADING"});

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
                {
                    this.state.data.image !== undefined
                        ? <img src={this.state.data.image} alt={this.state.data.model} className="card-img-top"/>
                        : null
                }
                <div className="card-body">
                    <h2 className="card-title">Редактирование авто</h2>
                    <br/>
                    <form>
                        <div className="form-group">
                            <label htmlFor="model">Модель</label>
                            <input type="text" className="form-control" placeholder="Модель" name="model"
                                   onChange={this.handleModel} defaultValue={this.state.data.model}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="color">Цвет</label>
                            <input type="text" className="form-control" placeholder="Цвет" name="color"
                                   onChange={this.handleColor} defaultValue={this.state.data.color}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cost">Цена</label>
                            <input type="number" className="form-control" placeholder="Цена" name="cost"
                                   onChange={this.handleCost} defaultValue={this.state.data.cost}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="yearOut">Год начала производства</label>
                            <input type="number" className="form-control" placeholder="Год" name="yearOut"
                                   onChange={this.handleYearOut}  defaultValue={this.state.data.yearOut}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="yearIn">Год окончания производства</label>
                            <input type="number" className="form-control" placeholder="Год" name="yearIn"
                                   onChange={this.handleYearIn} defaultValue={this.state.data.yearIn}/>
                        </div>
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={this.handleUploadImage}>
                                    <div className="form-group">
                                        <label htmlFor="photo">Фото</label>
                                        <input type="file" className="form-control-file" name="photo" ref={(ref) => {
                                            this.image = ref;
                                        }}/>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-group">
                                            <button className="btn btn-primary">Загрузка фото</button>
                                        </div>
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
                                </form>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group">
                            <button type="button" className="btn btn-primary" onClick={this.edit}>Создание</button>
                        </div>
                        <div className="form-group">
                            {
                                this.state.response === "DONE"
                                    ?
                                    <div className="alert alert-success">Изменено <Redirect to={"/auto/" + this.props.match.params._id}/></div>
                                    : null
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default EditAuto;