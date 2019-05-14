const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../schemas/userSchema');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.route('/login')
    .post((req, res) => {
        if (req.body.username == null) {
            res.status(401).json({
                message: "Auth failed"
            });
        } else {
            User.findOne({
                username: req.body.username
            })
                .then(user => {
                    if (user.length < 1) {
                        res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    bcrypt.compare(req.body.password, user.password, (error, result) => {
                        if (error) {
                            res.status(401).json({
                                message: "Auth failed"
                            });
                        }
                        if (result) {
                            const token = jwt.sign({
                                username: user.username,
                                userId: user._id
                            }, "secret", {
                                    expiresIn: "1h"
                                });
                            return res.status(200).json({
                                message: "Auth successful",
                                user: {
                                    firstname: user.firstname,
                                    lastname: user.lastname,
                                    manager: user.manager
                                },
                                token
                            });
                        }
                        res.status(401).json({
                            message: "Auth failed"
                        });
                    })
                })
                .catch(error => {
                    res.status(401).json({
                        message: "Auth failed"
                    });
                });
        }
    })

router.route('/register')
    .post((req, res) => {
        bcrypt.hash(req.body.password, 10, (err, hashPW) => {
            if (err) {
                res.status(500).json({
                    error: err
                });
            } else {
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    password: hashPW,
                    manager: req.body.manager   
                });

                user.save().then(data => {
                    res.json({
                        message: "User successfully created",
                        user: data
                    });
                })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        });
    });

module.exports = router;