const { generateToken } = require("../config/jwt");
const User = require("../models/userModel");

const registerUser = async(req, res) => {
    const {name, email, password, avatar} = req.body;

    if(!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    try {

        const user = await User.findOne({ email });
        if(user) {
            res.status(400);
            throw new Error("User Already exists");
        }
    
        const newUser = await User.create({ name, email, password, avatar });
        if (!newUser) {
            res.status(500);
            throw new Error("Error occured couldn't save user");
        } else {
            res
            .status(200)
            .json({ _id: newUser._id, name, email, avatar, token: generateToken(newUser._id) });
        }

    } catch (error) {
        res
        .status(500)
        .json({ message: "An Error occured during registerUser: " + error.message });
    }
}

module.exports = { registerUser };