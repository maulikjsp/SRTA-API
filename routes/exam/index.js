const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const createExam = require("./create-exam");
const deleteExam = require("./delete-exam");
const getExams = require("./get-exams");

router.post("/create-exam", tokenVerification, createExam);
router.get("/get-exams", tokenVerification, getExams);
router.delete("/delete-exam/:examcode", tokenVerification, deleteExam);

module.exports = router;
