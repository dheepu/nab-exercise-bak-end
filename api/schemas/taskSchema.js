const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    details: { type: String },
    dueDate: { type: String },
    completedDate: {type: String}
});

module.exports = mongoose.model('nabTask', taskSchema);