const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getSectionsStudent = require("./get-section-student");
const getExamProcedureStatusById = require("./get-exam-procedure");
const updateExamProcedureStatus = require("./update-procedure-status");
const completeExamProcedureStatus = require("./complete-procedure-status");

router.get("/get-section-students/:id", tokenVerification, getSectionsStudent);
router.get("/get-exam-procedure/:id", tokenVerification, getExamProcedureStatusById);
router.put("/update-exam-procedure-status", tokenVerification, updateExamProcedureStatus);
router.put("/complete-procedure-status", tokenVerification, completeExamProcedureStatus);

module.exports = router;
