const express = require('express');
const Sheet = require("../models/sheetModel");
const auth = require('../auth');
const router = express.Router();

router.route("/viewsheet", auth.verifyAdmin)
.get((req, res, next) => {
    Sheet.find()
        .then((sheet) => {
            console.log(sheet);
            res.json(sheet);
        })
        .catch((err) => {
            next(err)
        });
    })

module.exports = router;