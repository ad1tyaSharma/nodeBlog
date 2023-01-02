const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.register = async(req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body
    if (!name) {
        return res.status(400).json({
            error: 'Invalid Username'
        })
    }
    if (!password || password.length < 6) {
        return res.status(400).json({
            error: 'Invalid Password'
        })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            error: 'Invalid email'
        })
    }
    const hashedPwd = await bcrypt.hash(password, 10)
    try {
        const response = await User.create({
            name,
            email,
            password: hashedPwd
        })
        console.log('User created successfully: ', response)
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.json({ status: 'error', error: 'Username already in use' })
        }
        throw error
    }
    return res.json({
        msg: "Account has been created"
    })
}