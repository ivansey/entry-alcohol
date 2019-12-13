let mongoose = require('mongoose');

let rateSchema = new mongoose.Schema ({
    idAuto: String,
    date: Number,
    cost: Number,
    description: String,
    idUser: String,
});

let rateModel = mongoose.model("rate", rateSchema);

module.exports = rateModel;
