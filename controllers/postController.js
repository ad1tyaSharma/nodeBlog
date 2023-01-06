const Post = require("../models/post")
const User = require('../models/user')

exports.populateBlogs = (req, res) => {
Post.find({},((err,data)=>
{
    if(err)
    {
        console.log(err);
       return res.status(400).send("Website is under mantainence")
    }
    else
    {
        if(!data)
        {
           return  res.status(404).send("No posts Found 😥")
        }
        else
        {
           return res.status(200).render('home.ejs', { user: req.session.user, title: "Home | Blog" ,data})
        }
    }
}))
}
exports.createPostPage = (req, res) => {
    const cloudinary = {
            apiKey: process.env.CLOUDINARY_API_KEY,
            preset: process.env.CLOUDINARY_PRESET,
            name: process.env.CLOUDINARY_NAME
        }
        // console.log(cloudinary);
    res.render('createPost.ejs', {
        user: req.session.user,
        title: "Home | Blog",
        cloudinary
    })
}

exports.getPostDetail = (req, res) => {
    const id = req.params.id;
    Post.findOne({ _id: id }, (error, data) => {
        if (error) {
            res.status(400).redirect('/notFound')
        } else {
            // console.log(data)
            if (!data) {
                res.status(400).redirect('/notFound')
            } else {
                res.status(200).render('postDetail.ejs', { data, user: req.session.user, title: "Blog" })
            }
        }
    })
}

exports.editPostPage = (req, res) => {
    const id = req.params.id;
    const cloudinary = {
        apiKey: process.env.CLOUDINARY_API_KEY,
        preset: process.env.CLOUDINARY_PRESET,
        name: process.env.CLOUDINARY_NAME
    }
    Post.findOne({ _id: id }, (err, data) => {
        if (err) {
            res.status(400).redirect('/notFound')
        } else {
            if (!data || req.session.user.id != data.author) {
                res.status(400).redirect('/notFound')
            } else {
                res.status(200).render('editPost.ejs', { data, user: req.session.user, title: "Blog", cloudinary })
            }
        }
    })
}

exports.createPost = async(req, res) => {
    const { title, content, tag, image, author } = req.body;
    if (!title || !content || !tag || !image || !author) {
        return res.status(400).json({ error: "Please provide complete data" });
    } else {
        const post = new Post({
            title,
            author,
            content,
            image,
            tag,
            createdAt: new Date(),
            likes: 0
        })
        post.save((error) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ error: "Please try again" });

            } else {
                //console.log('User saved');\
                //console.log();
                return res.status(200).json({ msg: "Post Saved", id: post._id });

            }
        });
    }
}

exports.editPost = (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    if (!updates) {
        return res.status(400).json({ error: "Please provide complete data" });
    } else {
        Post.findOneAndUpdate({ _id: id }, updates, (error, user) => {
            if (error) {
                console.log(error);
                return res.status(400).json({ error: "Please try again" });
            } else {
                console.log(user);
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