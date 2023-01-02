exports.populateBlogs = (req, res) => {
    return res.send((req.session.user))
}