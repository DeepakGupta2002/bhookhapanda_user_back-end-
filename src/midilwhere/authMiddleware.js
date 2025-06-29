const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};

// middleware/protectUser.js
// const jwt = require("jsonwebtoken");

const protectUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 🔁 yaha pe admin ke jagah user
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};

module.exports = { protectUser, protect };


// module.exports = protect;
