const { pool } = require("../../config/db");
const getExams = async (req, res) => {
  try {
    const getExamsQuery = await pool.query("SELECT * FROM exams");
    const exams = getExamsQuery.rows;
    return res.status(200).json({
      exams: exams,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = getExams;
