// routes/auth.js

const express = require("express");
const router = express.Router();
const { initiateReset, verifyToken, resetPassword } = require("../controllers/authController");

router.post("/forgot-password", initiateReset);
router.get("/reset/:token", verifyToken);
router.post("/reset/:token", resetPassword);

module.exports = router;
