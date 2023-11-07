const express = require("express");
const { tokenVerification } = require("../middleware");
// const auth = require("./auth");
const user = require("./user");
const exam = require("./exam");
const student = require("./student");
const router = express.Router();

// AUTH Routes * /api/auth/*
// router.use("/auth", auth);
router.use("/user", user);
router.use("/exam", exam);
router.use("/student", student);
module.exports = router;
