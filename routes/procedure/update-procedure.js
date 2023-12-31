const { pool } = require("../../config/db");

const updateProcedure = async (req, res) => {
  try {
    const { title, sections, id } = req.body;
    const updated_at = new Date();
    // Check if the title is already exist
    const checkQuery = await pool.query("SELECT * FROM procedures WHERE title = $1 AND id != $2", [
      title,
      id,
    ]);
    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "procedures Name already exists",
      });
    }
    await pool.query(
      "UPDATE procedures SET title = $1, section_id = $2, updated_at = $3 WHERE id = $4",
      [title, sections, updated_at, id]
    );
    return res.status(200).json({
      message: "procedure updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = updateProcedure;
