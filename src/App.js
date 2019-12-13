import React from 'react';
import {BrowserRouter, Route} from "react-router-dom";
import jquery from "jquery";
import "popper.js/dist/popper.min";

import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

import "bootstrap/dist/js/bootstrap.min";
import "bootstrap/"

import Index from "./Index";
import Login from "./Login";
import Reg from "./Reg";
import UserInfo from "./UserInfo";
import Header from "./Header";
import AddCar from "./AddCar";
import GetAuto from "./GetAuto";
import EditAuto from "./EditAuto";
import AddRate from "./AddRate";

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Header/>
                    <Route path="/" exact component={Index}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/reg" component={Reg}/>
                    <Route path="/user/me/info" component={UserInfo}/>
                    <Route path="/add" component={AddCar}/>
                    <Route path="/auto/:_id" exact component={GetAuto}/>
                    <Route path="/auto/:_id/edit" component={EditAuto}/>
                    <Route path="/auto/:_id/rate/add" component={AddRate}/>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
