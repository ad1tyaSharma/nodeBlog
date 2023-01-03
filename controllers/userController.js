const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");

exports.register = async(req, res) => {
    //console.log(req.body);
    const {
        name,
        email,
        password
    } = req.body;
    if (!name) {
        return res.status(400).json({
            error: "Invalid Username",
        });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({
            error: "Invalid Password",
        });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            error: "Invalid email",
        });
    }
    const hashedPwd = await bcrypt.hash(password, 10);
    try {
        const response = await User.create({
            name,
            email,
            password: hashedPwd,
        });
        console.log("User created successfully: ", response);
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key
            return res.status(400).json({
                error: "User Alreasy Exists",
            });
        }
        throw error;
    }
    return res.json({
        msg: "Account has been created",
    });
};

exports.login = async(req, res) => {
    console.log(req.body);
    const {
        email,
        password
    } = req.body;
    User.findOne({
            email,
        },
        async(err, data) => {
            console.log(data);
            if (err) {
                console.log(err);
            }
            if (!data) {
                return res.status(401).json({
                    error: "User not found",
                });
            }
            if (data && (await bcrypt.compare(password, data.password))) {
                // the username, password combination is successful
                console.log("correct credentials");
                const token = await jwt.sign({
                        id: data._id,
                        email: data.email,
                        name: data.name,
                        role: data.role,
                    },
                    process.env.JWT_SECRET
                );
                console.log(token);
                if (!req.session.user) {
                    req.session.user = {
                        id: data._id,
                        email: data.email,
                        name: data.name,
                        role: data.role,
                    };

                }
                res
                    .status(201)
                    .cookie("token", token, {
                        expires: new Date(Date.now() + 24 * 3600000 * 30), // cookie will be removed after 30 days
                    })
                    .redirect("/posts");
            } else {
                return res.status(401).json({
                    error: "Invalid Credentials",
                });
            }
        }
    );
};