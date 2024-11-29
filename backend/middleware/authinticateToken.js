const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided. Please log in.",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token, please log in again.",
            });
        }

        req.user = user; // Attach user info to the request
        next();
    });
};

module.exports = authenticateToken;
