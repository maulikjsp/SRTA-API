const express = require("express");
const router = express.Router();
const getPermissions = require("./get-permission");
const getRoles = require("./get-roles");
const getExams = require("./get-exams");
const createPermission = require("./create-permission");
const createExam = require("./create-exams");
const deleteExam = require("./delete-exam");
const createUser = require("./create-user");
const createRole = require("./create-role");
const updateUser = require("./update-user");
const updatePermission = require("./update-permission");
const updateRole = require("./update-role");
const deleteUser = require("./delete-user");
const deletePermission = require("./delete-permission");
const getUserPermissions = require("./get-user-permissions");
const { tokenVerification } = require("../../middleware");
const { initiateReset, verifyToken, resetPassword } = require("../controllers/authController");

// Routes
router.get("/get-permissions", tokenVerification, getPermissions);
router.get("/get-roles", tokenVerification, getRoles);
router.get("/get-exams", tokenVerification, getExams);
router.post("/create-permission", tokenVerification, createPermission);
router.post("/create-role", tokenVerification, createRole);
router.post("/create-exam", tokenVerification, createExam);
router.post("/create-user", tokenVerification, createUser);
router.delete("/delete-user/:userId", tokenVerification, deleteUser);
router.put("/update-user/:userId", tokenVerification, updateUser);
router.put("/update-permission/:permissionId", tokenVerification, updatePermission);
router.put("/update-role/:roleId", tokenVerification, updateRole);
router.get("/get-user-permissions/:email", tokenVerification, getUserPermissions);
router.post("/forgot-password", initiateReset);
router.get("/reset/:token", verifyToken);
router.post("/reset/:token", resetPassword);

router.delete("/delete-exam/:examcode", tokenVerification, deleteExam);
router.delete("/delete-permission/:permissionId", tokenVerification, deletePermission);

module.exports = router;
