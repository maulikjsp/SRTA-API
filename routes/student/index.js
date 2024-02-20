const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const updateStudent = require("./updateStudent");
const getStudents = require("./getStudents");
const getStudentSections = require("./getStudentSections");
const getStudentsStatus = require("./getStudentStatus");
const getAllStudents = require("./getAllStudents");

router.put("/edit-student", tokenVerification, updateStudent);
router.get("/get-students", tokenVerification, getStudents);
router.get("/get-student-sections", tokenVerification, getStudentSections);
router.get("/get-students-status", tokenVerification, getStudentsStatus);
router.get("/get-all-students", tokenVerification, getAllStudents);

module.exports = router;
