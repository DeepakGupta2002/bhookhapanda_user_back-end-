const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    console.log(user);
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "30d" }
    );
};

module.exports = generateToken;
