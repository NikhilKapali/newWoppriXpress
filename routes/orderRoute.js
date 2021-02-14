const express = require('express');
const Order = require('../models/orderModel');
const auth = require('../auth');
const router = express.Router();

//user
router.route("/order", auth.verifyUser)
    .post((req, res, next) => {
        let order = new Order(req.body);
        order.owner = req.user._id;
        console.log(order);
        order.save()
            .then((order) => {
                res.statusCode = 201;
                res.json(order);
            }).catch(next)
    })

    .get((req, res, next) => {
        Order.find({ owner: req.user._id })
            .then((order) => {
                console.log(order);
                res.json(order);
            })
            .catch((err) => {
                next(err)
            });
    })
router.route("/order/:id")
    .delete((req, res, next) => {
        console.log(req.body);
        Order.findOneAndDelete({ _id: req.params.id })
            .then((order) => {
                if (order == null) throw new Error("Product not found");
                res.json(order)
            }).catch(next);
    })

module.exports = router;