const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const createExamProcedure = require("./create-exam-procedure");
const getExamProcedureStatus = require("./get-exam-procedure-status");
const deleteExamProcedure = require("./delete-exam-procedure");

router.post("/create-exam-procedure", tokenVerification, createExamProcedure);
router.get("/get-exam-procedure", tokenVerification, getExamProcedureStatus);
router.delete("/delete-exam-procedure/:id", tokenVerification, deleteExamProcedure);

module.exports = router;
