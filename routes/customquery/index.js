const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getSectionsStudent = require("./get-section-student");
const getExamProcedureStatusById = require("./get-exam-procedure");
const updateExamProcedureStatus = require("./update-procedure-status");
const completeExamProcedureStatus = require("./complete-procedure-status");
const getSubmittedExamProcedures = require("./get-submitted-procedure");
const getEvaluatorStatus = require("./get-evaluator-status");

router.get("/get-section-students/:id", tokenVerification, getSectionsStudent);
router.get("/get-exam-procedure/:id", tokenVerification, getExamProcedureStatusById);
router.put("/update-exam-procedure-status", tokenVerification, updateExamProcedureStatus);
router.put("/complete-procedure-status", tokenVerification, completeExamProcedureStatus);
router.get("/get-submitted-procedures", tokenVerification, getSubmittedExamProcedures);
router.post("/get-evaluator-status", tokenVerification, getEvaluatorStatus);

module.exports = router;
