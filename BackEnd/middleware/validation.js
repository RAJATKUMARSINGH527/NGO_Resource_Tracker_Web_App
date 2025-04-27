const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header using optional chaining
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) {
      return res.status(400).send({ error: 'Unauthorized access! Token missing.' });
    }

    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log('[VERIFY TOKEN] Decoded Token:', decoded);

    // Attach decoded user info to req.user (instead of req.body.user)
    req.user = decoded; // FULL decoded payload here
    req.userId = decoded.id || decoded.userId;// Optionally, attach userId as a separate property if needed

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error('[VERIFY TOKEN] Error:', error.message);
    res.status(403).json({ message: 'Invalid token!', error: error.message });
  }
};

module.exports = { verifyToken };
