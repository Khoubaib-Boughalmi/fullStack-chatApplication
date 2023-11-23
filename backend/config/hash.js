const bcryptjs = require("bcryptjs");

const hashPasswordFn = async(password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

const comparePasswordsFn = async(password, hashed_password) => {
    return await bcryptjs.compare(password, hashed_password)
}

module.exports = { hashPasswordFn, comparePasswordsFn }