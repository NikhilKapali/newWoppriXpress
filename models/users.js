const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    companyname: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    purpose: {
        type: String,
        required: true
    },
    resetLink: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('User', userSchema);