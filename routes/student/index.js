const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const updateStudent = require("./updateStudent");

router.put("/edit-student", tokenVerification, updateStudent);

module.exports = router;
