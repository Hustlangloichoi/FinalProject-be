const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate requests using JWT in Authorization header
 * Attaches decoded user info to req.user if valid
 */
module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
