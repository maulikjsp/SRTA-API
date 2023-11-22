const { pool } = require("../../config/db");

const createCategory = async (req, res) => {
  try {
    const { title, procedures } = req.body;
    // Check if the procedure already exists
    const checkQuery = await pool.query("SELECT * FROM categories WHERE title = $1", [title]);
    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "category already exists",
      });
    }
    await pool.query(`INSERT INTO categories (title, procedure_id) VALUES($1, $2)`, [
      title,
      procedures,
    ]);
    return res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server" });
  }
};

module.exports = createCategory;
