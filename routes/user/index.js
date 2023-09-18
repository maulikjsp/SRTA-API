const express = require("express");
const router = express.Router();
const getPermissions = require("./get-permission");
const getRoles = require("./get-roles");
const getExams = require("./get-exams");
const createPermission = require("./create-permission");
const { tokenVerification } = require("../../middleware");

// Routes
router.get("/get-permissions", tokenVerification, getPermissions);
router.get("/get-roles", tokenVerification, getRoles);
router.get("/get-exams", tokenVerification, getExams);
router.post("/create-permission", tokenVerification, createPermission);

module.exports = router;
