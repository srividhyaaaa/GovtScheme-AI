const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Validation helper middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMsgs = errors.array().map((e) => e.msg).join(", ");

    return res.status(400).json({
      success: false,
      message: errorMsgs || "Validation error.",
      errors: errors.array(),
    });
  };
};

router.post(
  "/register",
  validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ]),
  register
);

router.post(
  "/login",
  validate([
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]),
  login
);

router.get("/me", protect, getMe);

module.exports = router;