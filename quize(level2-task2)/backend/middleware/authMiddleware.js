const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
    }
    const token_d = token.split(' ')[1];
    console.log("token");
    console.log(token_d);
    try {
        const decoded = jwt.verify(token_d, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: 'Forbidden' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
exports.any = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'user') {
        return res.status(403).json({ error: 'Admin or User access required' });
    }
    next();
};