const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // console.log(req.cookies);
    const token = req.cookies['token'];
    console.log(token);
    if (!token) return res.status(401).redirect('/users/login');

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) return res.status(500).redirect('/users/login');
        req.session.user = decoded;
        next();
    });
};