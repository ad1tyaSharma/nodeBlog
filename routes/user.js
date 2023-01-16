const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/auth')

router.get("/login", (req, res) => {
    res.render('login.ejs',{
        title:"Login | Webie",
        user:undefined
    })
})
router.get("/register", (req, res) => {
    res.render('register.ejs',{
        title:"Register | Webie",
        user:undefined
    })
})
router.get('/forgot-password',userController.getForgotPassPage)
router.get('/logout', userController.logOut)
router.get('/forgot-password/:id/:token',userController.getResetPassPage)

router.get('/userProfile', verifyToken, userController.userProfile)

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get('/:id', verifyToken, userController.getUser)
router.get('/profile/:id',verifyToken,userController.userProfile)
router.get('/edit/:id',verifyToken,userController.editUserPage)
router.post('/:id/editUser',userController.editUser)
router.post('/forgot-password',userController.ForgotPass)
router.post('/reset-password/:id',userController.resetPass)
module.exports = router;