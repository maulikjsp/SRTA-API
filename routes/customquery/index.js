const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getSectionsStudent = require("./get-section-student");
const getExamProcedureStatusById = require("./get-exam-procedure");
const updateExamProcedureStatus = require("./update-procedure-status");

router.get("/get-section-students/:id", tokenVerification, getSectionsStudent);
router.get("/get-exam-procedure/:id", tokenVerification, getExamProcedureStatusById);
router.put("/update-exam-procedure-status", tokenVerification, updateExamProcedureStatus);

module.exports = router;
