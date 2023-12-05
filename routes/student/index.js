const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const updateStudent = require("./updateStudent");
const getStudents = require("./getStudents");
const getStudentSections = require("./getStudentSections");

router.put("/edit-student", tokenVerification, updateStudent);
router.get("/get-students", tokenVerification, getStudents);
router.get("/get-student-sections", tokenVerification, getStudentSections);

module.exports = router;
