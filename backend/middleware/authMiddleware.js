const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret");

      if (!process.env.MONGO_URI) {
        req.user = { _id: decoded.id, role: decoded.role };
        return next();
      }

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found or account disabled.",
        });
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Access denied. No authentication token provided.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = protect;