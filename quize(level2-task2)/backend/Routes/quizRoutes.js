const express = require('express');
const router = express.Router();
const Result = require('../models/Result');

router.post('/results', async(req, res) => {
    try {
        const { name, category, score } = req.body;
        const newResult = new Result({ name, category, score });
        await newResult.save();
        res.status(201).json(newResult);
    } catch (error) {
        res.status(500).json({ message: 'Error saving result', error });
    }
});

module.exports = router;