const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    lastName: {
        type: String, 
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    companywebsite: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', userSchema);
