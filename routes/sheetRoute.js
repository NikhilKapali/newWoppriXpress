const express = require('express');
const SheetList = require('../models/sheetModel');
const auth = require('../auth');
const router = express.Router();


//admin

// .get((req, res, next) => {
//     Order.findById()
//         .then((order) => {
//             console.log(order);
//             res.json(order);
//         })
//         .catch((err) => {
//             next(err)
//         });
// })

//user
router.route("/sheet", auth.verifyUser)
    .post((req, res, next) => {
        let sheet = new SheetList(req.body);
        sheet.owner = req.user._id;
        console.log(sheet);
        sheet.save()
            .then((sheet) => {
                res.statusCode = 201;
                res.json(sheet);
            }).catch(next)
    })

    .get((req, res, next) => {
        SheetList.find({ owner: req.user._id })
            .then((sheet) => {
                console.log(sheet);
                res.json(sheet);
            })
            .catch((err) => {
                next(err)
            });
    })
router.route("/sheet/:id")
    .delete((req, res, next) => {
        console.log(req.body);
        SheetList.findOneAndDelete({ _id: req.params.id })
            .then((sheet) => {
                if (sheet == null) throw new Error("Sheet not found");
                res.json(sheet)
            }).catch(next);
    })


module.exports = router;