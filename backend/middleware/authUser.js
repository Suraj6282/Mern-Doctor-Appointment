import jwt from 'jsonwebtoken'

// user authentication middleware
export const authUser = async (req, res, next) => {
    const { token } = req.headers
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// export default authUser;

// import jwt from 'jsonwebtoken'; // Adjust the path if needed
// import User from '../models/userModel.js';  // Import the User model

// // Middleware to authenticate user using JWT token
// export const authUser = async (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];  // Extract token from the "Authorization" header

//     if (!token) {
//         return res.status(401).json({ success: false, message: 'User is not logged in' });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Fetch user data from the database based on decoded token (contains user id)
//         const user = await User.findById(decoded.id);
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Attach user data to request object
//         req.user = user;
//         console.log('User:', user);
//         next();  // Pass the control to the next route handler
//     } catch (error) {
//         console.error(error);
//         res.status(403).json({ success: false, message: 'Token is not valid' });
//     }
// };


