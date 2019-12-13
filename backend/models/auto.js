let mongoose = require('mongoose');
let md5 = require('md5');

let autoSchema = new mongoose.Schema ({
    vendor: String,
    model: String,
    date: Number,
    image: String,
    yearOut: Number,
    yearIn: Number,
    color: String,
    cost: Number,
    engineType: String,
    governmentNumber: String,
    idUser: String,
});

autoSchema.index({model: "text", vendor: "text"});

let autoModel = mongoose.model("auto", autoSchema);

module.exports = autoModel;
