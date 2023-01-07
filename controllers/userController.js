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
exports.logOut = (req, res) => {
    res.clearCookie('token')
    req.session.destroy((error) => {
        if (error) throw error;
        res.redirect('/users/login');
    });
}
exports.getUser = (req, res) => {
    const _id = req.params.id;
    User.findOne({ _id }, (error, data) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: "User not found" })
        } else {
            if (!data) {
                res.status(400).json({ error: "User not found" })
            } else
                res.status(200).json({ data })
        }
    })
}
exports.userProfile = (req, res) => {
    const _id = req.params.id;
    User.findOne({_id},(err,usr)=>
    {
        if(err)
        {
            console.log(err);
            res.status(400).redirect('/')
        }
        else{
            if(!usr)
            {
                res.status(400).redirect('/')
            }
            else
            {
                res.status(200).render('profile.ejs',{
                    user:req.session.user,
                    data : usr,
                    title:"Profile | Blog"
                })
            }
        }
    })
   
}
exports.editUserPage = (req,res)=>
{
    const cloudinary = {
        apiKey: process.env.CLOUDINARY_API_KEY,
        preset: process.env.CLOUDINARY_PRESET,
        name: process.env.CLOUDINARY_NAME
    }
    const _id = req.params.id;
    User.findOne({_id},(err,usr)=>
    {
        if(err)
        {
            console.log(err);
            res.status(400).redirect('/')
        }
        else{
            if(!usr)
            {
                res.status(400).redirect('/')
            }
            else
            {
                res.status(200).render('editProfile.ejs',{
                    user:req.session.user,
                    data : usr,
                    title:" Edit Profile | Blog",
                    cloudinary
                })
            }
        }
    })
}
exports.editUser = (req,res)=>
{
    const _id = req.params.id;
    const {name,email,role,profilePic} =req.body;
    User.findOneAndUpdate({  _id}, { $set: { name,email,role,profilePic} }, (err, result) => {
       if(err)
       {
        console.log(err);
        return res.status(400).json({error:"Please try again!"})
       }
       else
       {
        return res.status(200).json({msg:"Profile Updated"})
       }
    })
}