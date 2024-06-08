const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);