const mongoose = require("mongoose");

const sheetScheme = new mongoose.Schema({
    ownerName: {
        type: String,
        required: true
    },
    datePresent: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    productDetail: {
        type: String,
        required: true
    },
    productAmount: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: String,
        required: true
    },
    remarks: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("SheetList", sheetScheme);