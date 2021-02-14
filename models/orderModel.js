const mongoose = require("mongoose");

const gameScheme = new mongoose.Schema({
    ownername: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    pickupDate: {
        type: String,
        required: true
    },
    pickupTime: {
        type: String,
        required: true
    },
    totalPackage: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Order", gameScheme);