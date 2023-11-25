const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyAuth = async(req, res, next) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decodedToken._id).select("-password");
            next();
        } catch (error) {
            return res.status(401).json("Not Autherized, Invalid Token");
        }
    } else {
        return res.status(401).json("Not Autherized, no Token");
    }
}

module.exports = { verifyAuth };