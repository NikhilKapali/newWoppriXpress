const express = require("express");
const mongoose = require("mongoose");
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const orderRouter = require('./routes/orderRoute');
const sheetRouter = require('./routes/sheetRoute');
const viewOrderRouter = require('./routes/viewOrder');
const viewSheetRouter = require('./routes/viewSheet');

const auth = require('./auth');

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(__dirname+"/public"));

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then((db) => {
        console.log("Successfully connected to MongodB server");
    }, (err) => console.log(err));
    
app.use('/api', userRouter);
app.use('/api', adminRouter);
app.use(auth.verifyUser);
app.use('/api', orderRouter);
app.use('/api', viewOrderRouter);
app.use('/api', sheetRouter);
app.use('/api', viewSheetRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.statusCode = 500;
    res.json({ status: err.message });
});

app.listen(process.env.PORT, () => {
    console.log(`App is running at localhost:${process.env.PORT}`);
});
