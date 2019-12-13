let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let md5 = require('md5');
let cors = require('cors');
let fileUpload = require("express-fileupload");
let nodemailer = require('nodemailer');

let smtp;

try {
    smtp = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'root@ivansey.ru',
            pass: '20021212QqQq'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });
} catch (e) {
    console.error(e);
}

const PORT = 3001;

mongoose.connect("mongodb://localhost/auto-landing");

let usersModel = require('./models/users');
let userSessionModel = require('./models/userSession');
let autoModel = require("./models/auto");
let rateModel = require("./models/rate");

let app = express();

app.use(bodyParser());
app.use(fileUpload());
app.use(cors());
app.use(express.static("storage"));

app.post("/api/v1/users/reg", (req, res) => {
    usersModel.find({email: req.body.email}).then(data => {
            if (data.length > 0) {
                res.json({response: "EMAIL_NOT_FREE"});
            } else {
                let user = new usersModel({
                    email: req.body.email,
                    type: "user",
                    pass: md5(req.body.pass),
                });
                user.save();
                res.json({response: "DONE"});
            }
        }
    );
});

app.post("/api/v1/users/login", (req, res) => {
    usersModel.find({email: req.body.email}).then(data => {
        if (data.length === 0) {
            res.json({response: "USER_NOT_FOUND", token: null});
        } else {
            if (data[0].validatePass(req.body.pass)) {
                res.json({response: "INVALID_PASSWORD", token: null});
            }

            let session = new userSessionModel({idUser: data[0]._id});

            let token = session.generateToken();
            session.token = token;

            session.save();
            res.json({response: "DONE", token: token});
        }
    })
});

app.post("/api/v1/users/checkToken", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            res.json({response: "NOT_TOKEN", _id: null, data: {}});
        }

        res.json({response: "CHECK_TOKEN_DONE", _id: data[0].idUser});
    });
});

app.post("/api/v1/users/get", (req, res) => {
    usersModel.findById(req.body._id).then(data => {
        res.json({
            response: "USER_FOUND", data: {
                _id: data._id,
                email: data.email
            }
        });
    });
});

app.post("/api/v1/users/auth/get", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            res.json({
                response: "NOT_ACCESS", data: {
                    _id: null,
                    email: null
                }
            });
        }

        usersModel.findById(data[0].idUser).then(data => {
            res.json({
                response: "USER_FOUND", data: {
                    _id: data._id,
                    email: data.email
                }
            });
        });
    });
});

app.post("/api/v1/auto/get", (req, res) => {
    autoModel.findOne({_id: req.body._id}).then((data) => {
        if (data.model === undefined) {
            res.json({
                response: "NOT_FOUND", data: {}
            });
        }

        res.json({
            response: "OK", data: data
        })
    })
});

app.post("/api/v1/auto/search", (req, res) => {
    if (req.body.search === "") {
        autoModel.find({}).sort({_id: -1}).then((data) => {
            if (data.length === 0) {
                res.json({
                    response: "NOT_FOUND", data: {}
                });
            }

            res.json({
                response: "OK", data: data
            });
        })
    } else {
        autoModel.find({
            $text: {$search: req.body.search},
        }).sort({_id: -1}).then((data) => {
            if (data.length === 0) {
                res.json({
                    response: "NOT_FOUND", data: {}
                });
            }

            res.json({
                response: "OK", data: data
            })
        })
    }
});

app.post("/api/v1/auto/add", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            return res.json({response: "NOT_ACCESS", _id: null});
        }

        let auto = new autoModel({
            model: req.body.vendor + " " + req.body.model,
            vendor: req.body.vendor,
            image: req.body.image,
            color: req.body.color,
            cost: Number(req.body.cost),
            yearOut: Number(req.body.yearOut),
            yearIn: Number(req.body.yearIn),
            engineType: req.body.engineType,
            date: Number(Date.now()),
            idUser: data[0].idUser,
        });
        console.log(auto);
        auto.save();
        return res.json({response: "DONE", _id: auto._id});
    });
});

app.post("/api/v1/auto/delete", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            return res.json({response: "NOT_ACCESS"});
        }

        autoModel.remove({_id: req.body._id}).then((data) => {
            return res.json({
                response: "DONE", data: data
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    });
});

app.post("/api/v1/auto/edit", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            return res.json({response: "NOT_ACCESS"});
        }

        autoModel.findById(req.body._id).then((data) => {
            if (data.length === 0) {
                return res.json({response: "NOT_FOUND"})
            }

            autoModel.updateOne({_id: req.body._id}, {
                model: req.body.model,
                color: req.body.color,
                cost: Number(req.body.cost),
                yearOut: Number(req.body.yearOut),
                yearIn: Number(req.body.yearIn),
            }).then((data) => {
                return res.json({response: "DONE"})
            }).catch((err) => {
                return res.status(500).send(err)
            });
        }).catch((err) => {
            return res.status(500).send(err)
        });
    });
});

app.post("/api/v1/auto/rate/get", (req, res) => {
    rateModel.find({idAuto: req.body._id}).then((data) => {
        if (data.length === 0) {
            res.json({
                response: "NOT_FOUND", data: {}
            });
        }

        res.json({
            response: "OK", data: data
        })
    })
});

app.post("/api/v1/auto/rate/add", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            return res.json({response: "NOT_ACCESS", _id: null});
        }

        let rate = new rateModel({
            idAuto: req.body.idAuto,
            cost: Number(req.body.cost),
            description: req.body.description,
            date: Number(Date.now()),
            idUser: data[0].idUser,
        });
        rate.save();
        return res.json({response: "DONE", _id: rate.idAuto});
    });
});

app.post("/api/v1/auto/rate/delete", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            return res.json({response: "NOT_ACCESS"});
        }

        rateModel.findById(req.body._id).then((data) => {
            if (data.length === 0) {
                return res.json({
                    response: "NOT_FOUND", data: {}
                });
            }

            return res.json({
                response: "DONE", data: data
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    });
});

app.post("/api/v1/auto/rate/edit", (req, res) => {
    userSessionModel.find({token: req.body.token}).then(data => {
        if (data.length === 0) {
            return res.json({response: "NOT_ACCESS"});
        }

        rateModel.findById(req.body._id).then((data) => {
            if (data.length === 0) {
                return res.json({response: "NOT_FOUND"})
            }

            rateModel.updateOne({_id: req.body._id}, {
                cost: Number(req.body.cost),
                description: req.body.description
            }).then((data) => {
                return res.json({response: "DONE"})
            }).catch((err) => {
                return res.status(500).send(err)
            });
        }).catch((err) => {
            return res.status(500).send(err)
        });
    });
});

app.post("/api/v1/storage/image/upload", (req, res) => {
    let file = req.files.file;

    file.mv("storage/image/" + req.body.filename, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({response: "OK", url: "/image/" + req.body.filename});
    })
});

// app.post("/storage/image/")

app.listen(PORT, () => console.log("Server started on port " + PORT));