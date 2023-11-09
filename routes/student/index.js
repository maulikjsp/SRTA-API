const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const updateStudent = require("./updateStudent");
const getStudents = require("./getStudents");

router.put("/edit-student", tokenVerification, updateStudent);
router.get("/get-students", tokenVerification, getStudents);

module.exports = router;
    