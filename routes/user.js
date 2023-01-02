const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
router.get("/login", (req, res) => {
    res.render('login.ejs')
})
router.get("/register", (req, res) => {
    res.render('register.ejs')
})
router.post("/register", userController.register)
router.post("/login", userController.login)
module.exports = router;