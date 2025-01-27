// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "No token provided. Please log in.",
//         });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid or expired token, please log in again.",
//             });
//         }

//         req.user = user; // Attach user info to the request
//         next();
//     });
// };

// module.exports = authenticateToken;

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Replace with your actual User model

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ success: false, message: 'User is not logged in' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token is not valid' });
        }

        // Fetch user data based on the decoded token (which contains user info)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        req.user = user;  // Add user data to the request
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = verifyToken;
