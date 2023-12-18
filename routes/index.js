const express = require("express");
const { tokenVerification } = require("../middleware");
// const auth = require("./auth");
const user = require("./user");
const exam = require("./exam");
const student = require("./student");
const procedure = require("./procedure");
const categories = require("./categories");
const questionnaires = require("./questionnaires");
const examProcedure = require("./exam-procedure-status");
const customQuery = require("./customquery");
const evaluation = require("./evaluation");
const router = express.Router();

// AUTH Routes * /api/auth/*
// router.use("/auth", auth);
router.use("/user", user);
router.use("/exam", exam);
router.use("/student", student);
router.use("/procedure", procedure);
router.use("/categories", categories);
router.use("/questionnaires", questionnaires);
router.use("/exam-procedure", examProcedure);
router.use("/custom-query", customQuery);
router.use("/evaluation", evaluation);

module.exports = router;
