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

    }),
    User = mongoose.model('User', userSchema);

module.exports = User;