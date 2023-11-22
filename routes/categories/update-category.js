const { pool } = require("../../config/db");

const updateCategory = async (req, res) => {
  try {
    const { id, title, procedures } = req.body;
    const updated_at = new Date();
    // Check if the title is already exist
    const checkQuery = await pool.query("SELECT * FROM categories WHERE title = $1", [title]);
    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "category already exists",
      });
    }
    await pool.query(
      "UPDATE categories SET title = $1, procedure_id = $2, updated_at = $3 WHERE id = $4",
      [title, procedures, updated_at, id]
    );
    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = updateCategory;
