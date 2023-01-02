const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, postController.populateBlogs)
module.exports = router;