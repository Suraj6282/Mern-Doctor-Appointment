import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const dtoken = authHeader && authHeader.split(' ')[1]; 
    console.log(dtoken);
    // Assumes 'Bearer <token>' format

    if (!dtoken) {
        return res.status(401).json({ success: false, message: 'Not Authorized, please log in again' });
    }
 
    try {
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        console.log('Decoded Token:', token_decode); // Debugging: check token content

        if (!token_decode.id) {
            return res.status(400).json({ success: false, message: 'Invalid token, doctor ID missing' });
        }

        // Attach the doctor ID to req.user
        req.user = { docId: token_decode.id };

        next();
    } catch (error) {
        console.log('Error in authDoctor:', error);
        res.status(403).json({ success: false, message: 'Invalid or expired token, please log in again' });
    }
};




export default authDoctor;


