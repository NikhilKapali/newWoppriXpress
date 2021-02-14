const express = require('express');
const Order = require("../models/orderModel");
const auth = require('../auth');
const router = express.Router();

router.route("/vieworder", auth.verifyAdmin)
    .get((req, res, next) => {
        Order.find()
            .then((order) => {
                console.log(order);
                res.json(order);
            })
            .catch((err) => {
                next(err)
            });
    })

module.exports = router;