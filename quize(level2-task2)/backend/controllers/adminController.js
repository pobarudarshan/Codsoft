const Category = require('../models/Category');
const Question = require('../models/Question');

exports.addCategory = async(req, res) => {
    try {
        const { name } = req.body;
        const category = new Category({ name });
        await category.save();
        res.status(201).json({ message: 'Category added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCategory = async(req, res) => {
    try {
        const categoryList = await Category.find();
        res.status(200).json({ category: categoryList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addQuestion = async(req, res) => {
    try {
        const { category, question, options, answer } = req.body;
        const newQuestion = new Question({ category, question, options, answer });
        console.log(newQuestion);
        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getQuestion = async(req, res) => {
    try {
        var questionlist = [];
        if (req.body.category === undefined || req.body.category === null || req.body.category === '') {
            questionlist = await Question.find();
        } else {
            const category = req.body.category;
            questionlist = await Question.find({ category: category });
        }
        res.status(200).json({ question: questionlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};