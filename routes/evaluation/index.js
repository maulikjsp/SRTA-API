const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getQuestionairesByProcedureId = require("./get-questionnaires");

router.get("/get-questionnairesById/:id", tokenVerification, getQuestionairesByProcedureId);

module.exports = router;
