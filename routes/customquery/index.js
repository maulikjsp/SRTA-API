const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getSectionsStudent = require("./get-section-student");
const getExamProcedureStatusById = require("./get-exam-procedure");

router.get("/get-section-students/:id", tokenVerification, getSectionsStudent);
router.get("/get-exam-procedure/:id", tokenVerification, getExamProcedureStatusById);

module.exports = router;
