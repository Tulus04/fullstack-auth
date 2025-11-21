const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            throw new Error('');
        }

        const decoded = jwt.verify(token, 'jwt_key');
        const user = await User.findByPk(decoded.id);

        if (!user) {
            throw new Error('');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Belum ter-autentikasi' });
    }
};

module.exports = auth;