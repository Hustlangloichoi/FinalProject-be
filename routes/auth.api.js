const express = require("express");
const { registerUser, loginUser, refreshToken } = require("../controllers/authController");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { authSchemas, userSchemas } = require("../validationSchemas/validationSchemas");

const router = express.Router();

// POST /auth/register - Register
router.post("/register", validateRequest(userSchemas.register), registerUser);

// POST /auth/login - Login
router.post("/login", validateRequest(authSchemas.login), loginUser);

// POST /auth/refresh - Refresh access token
router.post("/refresh", refreshToken);

module.exports = router;
