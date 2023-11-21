const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");
const createProcedure = require("./create-procedure");
const getProcedure = require("./get-procedure");

router.post("/create-procedure", tokenVerification, createProcedure);
router.get("/get-procedures", tokenVerification, getProcedure);

module.exports = router;
