const { pool } = require("../../config/db");

const getCategories = async (req, res) => {
  try {
    const categoriesQuery = await pool.query("SELECT * FROM categories");
    const categories = categoriesQuery.rows;
    return res.status(201).json({ categories: categories });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server" });
  }
};

module.exports = getCategories;
