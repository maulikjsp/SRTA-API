const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const createExam = require("./create-exam");
const getExams = require("./get-exams");

router.post("/create-exam", tokenVerification, createExam);
router.get("/get-exams", tokenVerification, getExams);

module.exports = router;
