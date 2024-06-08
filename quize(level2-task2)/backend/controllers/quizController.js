const Category = require('../models/Category');
const Question = require('../models/Question');

exports.getCategories = async(req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getQuestionsByCategory = async(req, res) => {
    try {
        const category = req.params.category;
        const questions = await Question.find({ category });
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};