const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const sib = require("sib-api-v3-sdk");

exports.register = async (req, res) => {
  //console.log(req.body);
  const { name, email, password } = req.body;
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

exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  User.findOne(
    {
      email,
    },
    async (err, data) => {
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
        const token = await jwt.sign(
          {
            id: data._id,
            email: data.email,
            name: data.name,
            role: data.role,
            image : data.profilePic
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
            image : data.profilePic

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
  res.clearCookie("token");
  req.session.destroy((error) => {
    if (error) throw error;
    res.redirect("/users/login");
  });
};
exports.getUser = (req, res) => {
  const _id = req.params.id;
  User.findOne({ _id }, (error, data) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "User not found" });
    } else {
      if (!data) {
        res.status(400).json({ error: "User not found" });
      } else res.status(200).json({ data });
    }
  });
};
exports.userProfile = (req, res) => {
  const _id = req.params.id;
  User.findOne({ _id }, (err, usr) => {
    if (err) {
      console.log(err);
      res.status(400).redirect("/");
    } else {
      if (!usr) {
        res.status(400).redirect("/");
      } else {
        res.status(200).render("profile.ejs", {
          user: req.session.user,
          data: usr,
          title: "Profile | Blog",
        });
      }
    }
  });
};
exports.editUserPage = (req, res) => {
  const cloudinary = {
    apiKey: process.env.CLOUDINARY_API_KEY,
    preset: process.env.CLOUDINARY_PRESET,
    name: process.env.CLOUDINARY_NAME,
  };
  const _id = req.params.id;
  User.findOne({ _id }, (err, usr) => {
    if (err) {
      console.log(err);
      res.status(400).redirect("/");
    } else {
      if (!usr) {
        res.status(400).redirect("/");
      } else {
        res.status(200).render("editProfile.ejs", {
          user: req.session.user,
          data: usr,
          title: " Edit Profile | Blog",
          cloudinary,
        });
      }
    }
  });
};
exports.editUser = (req, res) => {
  const _id = req.params.id;
  const { name, email, role, profilePic } = req.body;
  User.findOneAndUpdate(
    { _id },
    { $set: { name, email, role, profilePic } },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Please try again!" });
      } else {
        return res.status(200).json({ msg: "Profile Updated" });
      }
    }
  );
};
exports.getForgotPassPage = (req, res) => {
  res.render("forgotPass.ejs",
  {
    title:"Forgot Password | Webie",
    user:undefined
  });
};
exports.ForgotPass = (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, data) => {
    if (err) {
      return res.status(400).json({ error: "Please try again" });
    } else {
      if (!data) {
        return res.status(400).json({ error: "User not found!!" });
      } else {
        const secret = `${process.env.JWT_SECRET}${data.password}`;
        const token = jwt.sign(
          {
            id: data._id,
            email: data.email,
          },
          secret,
          {
            expiresIn: "5m",
          }
        );
        const client = sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.SIB_KEY;
        const transEmailApi = new sib.TransactionalEmailsApi();

        const sender = {
          email: "mail4trial4@gmail.com",
          name: "Admin",
        };

        const receivers = [
          {
            email,
          },
        ];
        transEmailApi
          .sendTransacEmail({
            sender,
            to: receivers,
            subject: "Password Reset Link",
            htmlContent: `
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="${process.env.HOST}/" style="font-size:1.4em;color: #01D28E;text-decoration:none;font-weight:600">Blog</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>We received a request to reset your password.Reset link is valid for 5 minutes</p>
    <a href="${process.env.HOST}/users/forgot-password/${data._id}/${token}" style="background: #01D28E; text-decoration: none;margin: 0 auto;width: max-content;padding: 10px 10px;color: #fff;border-radius: 4px;">Reset Password</a>
    <p style="font-size:0.9em;">Regards,<br />Your Brand</p>
    <hr style="border:none;border-top:1px solid #eee" />
    
  </div>
</div>
            `,
            params: {
              link: `${process.env.HOST}/users/forgot-password/${data._id}/${token}`,
            },
          })
          .then(
            res.status(200).json({
              msg: "Link Sent",
              link: `${process.env.HOST}/users/forgot-password/${data._id}/${token}`,
            })
          )
          .catch(console.log);
      }
    }
  });
};
exports.getResetPassPage = (req, res) => {
  const { id, token } = req.params;

  User.findOne({ _id: id }, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(404).redirect("/notFound");
    } else {
      if (!data) {
        return res.status(404).redirect("/notFound");
      } else {
        const secret = `${process.env.JWT_SECRET}${data.password}`;
        try {
          const payload = jwt.verify(token, secret);
          return res.render("resetPass.ejs", {
            id,
            token,
            title:"Reset Password",
            user: undefined
          });
        } catch (error) {
          console.log(error);
          return res.status(400).redirect("/notFound");
        }
      }
    }
  });
};

exports.resetPass = async (req, res) => {
  const { id } = req.params;
  const hashedPwd = await bcrypt.hash(req.body.password, 10);
  User.findOneAndUpdate(
    { _id: id },
    { $set: { password: hashedPwd } },
    (err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Please try again" });
      } else {
        if (!data) {
          return res.status(400).json({ error: "User not found" });
        } else {
          res.status(200).json({ msg: "Password Updated" });
        }
      }
    }
  );
};
