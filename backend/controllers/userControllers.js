const { generateToken } = require("../config/jwt");
const User = require("../models/userModel");
const { hashPasswordFn, comparePasswordsFn } = require("../config/hash");

const registerUser = async(req, res) => {
    const {name, email, password, avatar} = req.body;
    if(!name || !email || !password || !avatar) {
        console.log(name, email, password, avatar);
        return res.status(400).json({ message:"PUT ALL FIELDS" });
    }
    try {

        const user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message:"User Already exists" });
        }

        const new_password = await hashPasswordFn(password) //hash password before saving it
        const newUser = await User.create({ name, email, password: new_password, avatar });
        if (!newUser) {
            return res.status(500).json({ message:"Error occured couldn't save user" });
        } else {
            res.status(200).json({ _id: newUser._id, name, email, avatar, token: generateToken(newUser._id) });
        }

    } catch (error) {
        res
        .status(500)
        .json({ message: "Register User Err: ", error: error.message  });
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ email });
        if(!user || !(await comparePasswordsFn(password, user.password)))
            return res.status(401).json({ message: "Wrong Cerdentials user not found"});
        return res.status(200).json({
            _id : user._id,
            name : user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        })
    } catch (error) {
        return res.status(400).json({message: "Login User Error", error: error.message});
    }
} 

/*
    Search for a specific user, if no userId is provided return all users in
    DB except the current logged in user
*/
const findUsers = async(req, res) => {
    const customQuery = req.query.search ?
    { $or: [
        { "name": { $regex: req.query.search, $options: 'i' }},
        { "email":{ $regex: req.query.search, $options: 'i' }}
        ] 
    } : {};
    try {
        const users = await User.find(customQuery).find({_id: { $ne: req.user._id }});
        if(users.length === 0)
            return res.status(404).json({message: "No Users Found"});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({message: "Search Users Error", error: error.message});
    }
}

module.exports = { registerUser, loginUser, findUsers };