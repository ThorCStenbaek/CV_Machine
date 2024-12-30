const jwt = require('jsonwebtoken');

// It's best to keep your secret key in an environment variable
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_default_secret_key';  

function generateToken(identifier) {
    return jwt.sign({ identifier }, SECRET_KEY, { expiresIn: '10y' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Format is "Bearer [TOKEN]"

    if (!token){
        console.log("failed to authenticate token")
        return res.sendStatus(401);  // No token provided
        }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.sendStatus(403);  // Invalid token
        req.user = decoded;  // Now req.user contains the decoded payload
        next();  // Proceed to the next middleware/function
    });
}

module.exports = { generateToken, authenticateToken };
