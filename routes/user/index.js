const express = require("express");
const router = express.Router();
const getPermissions = require("./get-permission");
const { tokenVerification } = require("../../middleware");

// Routes
router.get("/get-permissions", tokenVerification, getPermissions);

module.exports = router;
