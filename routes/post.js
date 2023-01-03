const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, postController.populateBlogs)

router.post('/createPost', postController.createPost)
router.post('/editPost', postController.editPost)
router.post('/deletePost', postController.deletePost)

module.exports = router;