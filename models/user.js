const mongoose = require('mongoose');
const Schema = mongoose.Schema;


userSchema = new Schema({

        email: {
            type: String,
            unique: true,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: "blogger"
        },
        profilePic: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
        },
        likes: [String]

    }),
    User = mongoose.model('User', userSchema);

module.exports = User;