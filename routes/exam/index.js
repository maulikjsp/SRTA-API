const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const createExam = require("./create-exam");
const deleteExam = require("./delete-exam");
const getExams = require("./get-exams");
const updateExam = require("./update-exam");
const getExamSections = require("./get-examSections");
const getExamStudents = require("./get-examStudents");

router.post("/create-exam", tokenVerification, createExam);
router.get("/get-exams", tokenVerification, getExams);
router.put("/update-exam", tokenVerification, updateExam);
router.delete("/delete-exam/:id", tokenVerification, deleteExam);
router.get("/get-exam-section/:id/:date", tokenVerification, getExamSections);
router.get("/get-exam-students/:id", tokenVerification, getExamStudents);

module.exports = router;
