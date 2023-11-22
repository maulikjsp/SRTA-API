const express = require("express");
const router = express.Router();
const { tokenVerification } = require("../../middleware");
const createCategory = require("./create-category");
const getCategories = require("./get-categories");
const deleteCategory = require("./delete-category");
const updateCategory = require("./update-category");

router.post("/create-category", tokenVerification, createCategory);
router.get("/get-categories", tokenVerification, getCategories);
router.delete("/delete-category/:id", tokenVerification, deleteCategory);
router.put("/update-category", tokenVerification, updateCategory);

module.exports = router;
