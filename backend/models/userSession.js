let mongoose = require('mongoose');
let md5 = require('md5');

let userSessionSchema = new mongoose.Schema({
    idUser: String,
    token: String
});

userSessionSchema.method("generateToken", () => {
    let result = '';
    let characters = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890';
    let length = 1028;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * length));
    }

    this.token = result;
    return result;
});

let userSessionModel = mongoose.model("userSessions", userSessionSchema);

module.exports = userSessionModel;
