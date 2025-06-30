/**
 * Middleware to restrict access to admin users only
 * Checks req.user.isAdmin set by authentication middleware
 */

module.exports = function (req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
