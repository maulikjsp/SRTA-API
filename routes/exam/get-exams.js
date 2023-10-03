const { pool } = require("../../config/db");

const getExamData = async (req, res) => {
  try {
    const examDataQuery = await pool.query("SELECT * FROM examdata");
    const examData = examDataQuery.rows;
    return res.status(200).json({
      exams: examData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
};
module.exports = getExamData;
