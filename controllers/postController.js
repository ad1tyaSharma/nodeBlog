const Post = require("../models/post")

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