let mongoose = require('mongoose');
let md5 = require('md5');

let usersSchema = new mongoose.Schema ({
    email: String,
    pass: String,
    type: String,
});

usersSchema.method("setPass", (pass) => {
    this.pass = md5(pass);
});

usersSchema.method("validatePass", (pass) => {
    return this.pass === md5(pass);
});

let usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
