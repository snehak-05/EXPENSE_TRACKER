const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./config');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, jwtSecret || process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id }

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err.message);
    return res.status(401).json({ error: 'Unauthorized or invalid token' });
  }
}

module.exports = authMiddleware;
