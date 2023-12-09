const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getSectionsStudent = require("./get-section-student");

router.get("/get-section-students/:id", tokenVerification, getSectionsStudent);

module.exports = router;
