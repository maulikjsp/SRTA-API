const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");
const createProcedure = require("./create-procedure");
const getProcedure = require("./get-procedure");
const deleteProcedure = require("./delete-procedure");
const updatedProcedure = require("./update-procedure");
const getEvaluationProcedure = require("./get-procedures-evaluation");

router.post("/create-procedure", tokenVerification, createProcedure);
router.get("/get-procedures", tokenVerification, getProcedure);
router.get("/get-evaluation-procedures", tokenVerification, getEvaluationProcedure);
router.delete("/delete-procedure/:id", tokenVerification, deleteProcedure);
router.put("/update-procedure", tokenVerification, updatedProcedure);
module.exports = router;
