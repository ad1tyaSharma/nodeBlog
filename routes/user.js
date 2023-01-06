const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/auth')

router.get("/login", (req, res) => {
    res.render('login.ejs')
})
router.get("/register", (req, res) => {
    res.render('register.ejs')
})
router.get('/logout', userController.logOut)
router.get('/userProfile', verifyToken, userController.userProfile)

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get('/:id', verifyToken, userController.getUser)
router.get('/profile/:id',verifyToken,userController.userProfile)
router.get('/edit/:id',verifyToken,userController.editUserPage)
router.post('/:id/editUser',userController.editUser)
module.exports = router;