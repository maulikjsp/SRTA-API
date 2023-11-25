const express = require("express");
const { tokenVerification } = require("../middleware");
// const auth = require("./auth");
const user = require("./user");
const exam = require("./exam");
const student = require("./student");
const procedure = require("./procedure");
const categories = require("./categories");
const questionnaires = require("./questionnaires");
const router = express.Router();

// AUTH Routes * /api/auth/*
// router.use("/auth", auth);
router.use("/user", user);
router.use("/exam", exam);
router.use("/student", student);
router.use("/procedure", procedure);
router.use("/categories", categories);
router.use("/questionnaires", questionnaires);

module.exports = router;
