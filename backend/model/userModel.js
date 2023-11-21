const mongoose = require("mongoose");

const userModel = mongoose.Schema (
    {
        name: {type: String, required: true, trim: true},
        email: {type: String, required: true, trim: true},
        password: {type: String, required: true},
        avatar: {type: String, default: "https://profile.intra.42.fr/images/default.png" }
    },
    { timestamps: true }
)

const User = mongoose.model("User", userModel);
module.exports = { User };