const express = require('express');
const bcrypt = require('bcrypt');
const Task = require('../schemas/taskSchema');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.route('/')
    .get((req, res) => {
        Task.find().exec().then(tasks => {
            res.status(200).json({
                message: "Success",
                tasks
            })
        })
    })
    .post(checkAuth, (req, res) => {
        const task = new Task({
            _id: mongoose.Types.ObjectId(),
            title: req.body.title,
            details: req.body.details,
            dueDate: req.body.dueDate
        });
        task.save().then(task => {
            res.status(200).json({
                message: "Task saved."
            });
        })
            .catch(error => {
                res.status(500).json({
                    message: "Task saving failed."
                });
            });
    })

router.route('/:id')
    .patch(checkAuth, (req, res) => {
        const id = req.params.id;
        console.log(id);
        const task = {            
            title: req.body.title,
            details: req.body.details,
            dueDate: req.body.dueDate,
            completedDate: req.body.completedDate
        };
        console.log(task);
        Task.update({ _id: id }, { $set: task }).exec().then(data => {
            res.status(200).json({
                message: "Task updated."
            });
        })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    })

module.exports = router;