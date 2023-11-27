const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");

const getQuestionnaires = require("./get-questionnaoires");
const createQuestionnaires = require("./create-questionnaires");
const deleteQuestionnaires = require("./delete-questionnaires");
const getCriterias = require("./get-criterias");

router.get("/get-questionnaires", tokenVerification, getQuestionnaires);
router.post("/create-questionnaires", tokenVerification, createQuestionnaires);
router.delete(
  "/delete-questionnaires/:id",
  tokenVerification,
  deleteQuestionnaires
);
router.get("/get-criterias", tokenVerification, getCriterias);

module.exports = router;
