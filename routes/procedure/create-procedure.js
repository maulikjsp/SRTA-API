const { pool } = require("../../config/db");

const createProcedure = async (req, res) => {
  try {
    const { name, sections } = req.body;
    // Check if the procedure already exists
    const checkQuery = await pool.query("SELECT * FROM procedures WHERE title = $1", [name]);
    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Procedure already exists",
      });
    }
    await pool.query(`INSERT INTO procedures (section_id, title) VALUES ($1, $2)`, [
      sections,
      name,
    ]);

    return res.status(201).json({ message: "procedure added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server" });
  }
};

module.exports = createProcedure;
