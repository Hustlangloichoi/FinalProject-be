const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/authController");
const validateRequest = require("../middlewares/validationRequest.middleware");
const {
  authSchemas,
  userSchemas,
} = require("../validationSchemas/validationSchemas");

const router = express.Router();

router.post("/register", validateRequest(userSchemas.register), registerUser);

router.post("/login", validateRequest(authSchemas.login), loginUser);

router.post("/refresh", refreshToken);

module.exports = router;
