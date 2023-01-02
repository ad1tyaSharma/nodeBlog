const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
router.get("/login", (req, res) => {
    res.render('login.ejs')
})
router.get("/register", (req, res) => {
    res.render('register.ejs')
})
router.get('/logout', (req, res) => {
    // delete token 
    res.clearCookie('token')
        //delete session
    req.session.destroy((error) => {
        if (error) throw error;
        res.redirect('/users/login');
    });
})
router.post("/register", userController.register)
router.post("/login", userController.login)
module.exports = router;