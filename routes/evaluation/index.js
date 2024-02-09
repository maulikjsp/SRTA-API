const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getQuestionairesByProcedureId = require("./get-questionnaires");
const addExamResult = require("./add-exam-result");
const getProcedures = require("./get-exam-procedure");
const getEscalatedStudent = require("./get-escalated-students");

router.get("/get-questionnairesById/:id", tokenVerification, getQuestionairesByProcedureId);
router.post("/add-exam-result", tokenVerification, addExamResult);
router.get("/get-procedures", tokenVerification, getProcedures);
router.get("/get-escalated-students", tokenVerification, getEscalatedStudent);

module.exports = router;
