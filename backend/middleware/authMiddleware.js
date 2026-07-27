const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Save decoded user data to request (ensuring both _id and id are accessible)
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        ...decoded,
      };

      // Continue to next middleware/route
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
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