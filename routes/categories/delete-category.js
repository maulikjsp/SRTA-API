const { pool } = require("../../config/db");

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if category is exist or not
    const checkQuery = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    if (checkQuery.rows.length === 0) {
      return res.status(400).json({
        message: "Category not found",
      });
    }
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
    return res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = deleteCategory;
