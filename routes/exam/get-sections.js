const { pool } = require("../../config/db");

const getSections = async (req, res) => {
  try {
    const sectionQuery = await pool.query("SELECT * FROM sections");

    const sectionsData = sectionQuery.rows;

    return res.status(200).json({
      sections: sectionsData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = getSections;
