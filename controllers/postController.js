const Post = require("../models/post")
const User = require('../models/user')
exports.populateBlogs = (req, res) => {
    return res.render('base.ejs', { user: req.session.user })
}
exports.createPost = async(req, res) => {
    const { title, content, tag } = req.body;
    if (!title || !content || !tag) {
        return res.status(400).json({ error: "Please provide complete data" });
    } else {
        const post = new Post({
            title,
            author: 'Aditya',
            content,
            image: "https://via.placeholder.com/1280x720",
            tag,
            createdAt: new Date(),
            likes: 0
        })
        post.save((error) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ error: "Please try again" });

            } else {
                console.log('User saved');
                return res.status(200).json({ msg: "Post Saved" });

            }
        });
    }
}

exports.editPost = (req, res) => {
    const updates = req.body;
    if (!updates) {
        return res.status(400).json({ error: "Please provide complete data" });
    } else {
        Post.findOneAndUpdate({ _id: updates.id }, updates, (error, user) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ error: "Please try again" });
            } else {
                console.log('User saved');
                return res.status(200).json({ msg: "Post Updated" });

            }
        });
    }
}

exports.deletePost = (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: "Please try again" });
    } else {
        Post.findOneAndDelete({ _id: id }, (error) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ error: "Please try again" });
            } else {
                console.log('User saved');
                return res.status(200).json({ msg: "Post Deleted" });

            }
        });
    }
}

exports.addLike = async(req, res) => {
    const id = req.params.id;
    // console.log(`blog id is : ${id}`);
    const userId = req.body.id;
    const post = await Post.findById({ _id: id });
    if (!post) {
        return res.status(400).json({ error: "Please try again" });
    } else {
        post.likes++;
        await post.save();
        User.updateOne({ _id: userId }, { $set: { likes: [id] } }, (error) => {
            if (error) {
                return res.status(400).json({ error: "Please try again" });
            }
        });
        return res.status(200).json({ msg: "Thanks for you feedback", likes: post.likes });
    }

}
exports.unLike = async(req, res) => {
    const id = req.params.id;
    const userId = req.body.id;
    const post = await Post.findById({ _id: id });
    if (!post) {
        return res.status(400).json({ error: "Please try again" });
    } else {
        if (post.likes != 0)
            post.likes--;
        await post.save();
        User.updateMany({ _id: userId }, { $pullAll: { likes: [id] } }, (error) => {
            if (error) {
                return res.status(400).json({ error: "Please try again" });
            }
        });
        return res.status(200).json({ msg: "Like Removed", likes: post.likes });
    }

}