const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const createExam = require("./create-exam");

router.post("/create-exam", tokenVerification, createExam);

module.exports = router;
