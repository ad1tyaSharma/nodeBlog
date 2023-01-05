const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, postController.populateBlogs)
router.get('/create', verifyToken, postController.createPostPage)
router.get('/:id', verifyToken, postController.getPostDetail)
router.get('/:id/edit', verifyToken, postController.editPostPage)

router.post('/createPost', postController.createPost)
router.post('/:id/editPost', postController.editPost)
router.post('/deletePost', postController.deletePost)
router.post('/:id/like', postController.addLike)
router.post('/:id/unlike', postController.unLike)
module.exports = router;