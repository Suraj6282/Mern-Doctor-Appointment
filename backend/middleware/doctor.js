import jwt from "jsonwebtoken"

const decodeToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
        req.decoded = decoded;
        next();
    } catch (error) {
        console.error('Error decoding token:', error);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};


export default decodeToken;