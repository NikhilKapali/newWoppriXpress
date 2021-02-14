const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const router = express.Router();
const auth = require('../auth');
const _ = require('lodash');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandboxf748a3983dde4a87a1d5fbdba475f4dd.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });

router.post('/signup', (req, res, next) => {
    let password = req.body.password;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            throw new Error('Could not hash!');
        }
        User.create({
            companyname: req.body.companyname,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
            image: req.body.image,
            purpose: req.body.purpose
        }).then((user) => {
            let token = jwt.sign({ _id: user._id }, process.env.SECRET);
            res.json({ status: "Signup success!", token: token });
            console.log(token);
        }).catch(next);
    });
});

router.post('/login', (req, res, next) => {
    console.log(req.body)
    User.findOne({ name: req.body.name })
        .then((user) => {
            if (user == null) {
                let err = new Error('User not found!');
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match!');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        res.json({ status: 'Login success!', token: token });
                    }).catch(next);
            }
        }).catch(next);
})

router.get('/profile', auth.verifyUser, (req, res, next) => {
    console.log(req.user.image);
    res.json({ _id: req.user._id, companyname: req.user.companyname, name: req.user.name, email:req.user.email, phone:req.user.phone, image: req.user.image, purpose:req.user.purpose});
});

router.put('/UserUpdateAndroid', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json({ _id: user._id, companyname: user.companyname, name: user.name, email: user.email, phone: user.phone, image: user.image });
        }).catch(next);
});

router.put('/forgotPassword', (req, res, next) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {

            return res.status(400).json({ error: "User with this email does not exits" });
            
        }

        const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY);
        const url = `http://localhost:3000/resetPassword/${token}`;
        const data = {
            from: 'wopprigaming@gmail.com',
            to: email,
            subject: 'Reset Account Link',
            html: `
 <h2> Please click the following link to reset your password </h2>
                <a href = "${url}">${url}</a>
                `
        };

        return user.updateOne({ resetLink: token }, function (err, success) {
            if (err) {
                return res.status(400).json({ error: "Reset link has already been sent to your email" });
            }
            else {
                mg.messages().send(data, function (error, body) {
                    if (error) {
                        return res.json({
                            error: err.message
                        })
                    }

                    return res.json({ message: 'Email has been sent to reset password' });

                });
            }
        })
    })
})

router.put('/resetPassword/:resetLink', (req, res) => {
    const { resetLink, newPassword } = req.body;


    bcrypt.hash(newPassword, 10, function (err, hash) {
        if (err) {
            throw new Error('Could Not Hash!');
        }

        if (resetLink) {
            jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (error, decodedData) {
                if (error) {
                    return res.status(401).json({
                        error: "Incorrect Token"
                    })
                }
                User.findOne({ resetLink }, (err, user) => {
                    if (err || !user) {
                        return res.status(400).json({ error: "User with this token does not exists." });
                    }
                    const obj = {
                        password: hash
                    }
                    user = _.extend(user, obj);
                    user.save((err, result) => {
                        if (err) {
                            return res.status(400).json({ error: "Reset Password Error" });

                        }
                        else {
                            return res.status(200).json({ message: 'Your Password has been changed' });
                        }
                    })
                })
            })

        } else {
            return res.status(401).json({ error: "Authentication Error" });
        }
    })


})

module.exports = router;
