const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");
const createProcedure = require("./create-procedure");
const getProcedure = require("./get-procedure");
const deleteProcedure = require("./delete-procedure");

router.post("/create-procedure", tokenVerification, createProcedure);
router.get("/get-procedures", tokenVerification, getProcedure);
router.delete("/delete-procedure/:id", tokenVerification, deleteProcedure);
module.exports = router;
