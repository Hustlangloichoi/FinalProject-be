const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const validateRequest = require("../middlewares/validationRequest.middleware");
const { authSchemas } = require("../validationSchemas/validationSchemas");

const router = express.Router();

// POST /auth/register - Register
router.post("/auth/register", validateRequest(authSchemas.login), registerUser);

// POST /auth/login - Login
router.post("/auth/login", validateRequest(authSchemas.login), loginUser);

module.exports = router;
