const { pool } = require("../../config/db");

const createProcedure = async (req, res) => {
  try {
    const { name, sections } = req.body;

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
