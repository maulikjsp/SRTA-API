const { pool } = require("../../config/db");

const deleteExam = async (req, res) => {
  try {
    const examcode = req.params.examcode;
    await pool.query(`DELETE FROM exams WHERE examcode='${examcode}'`);
    return res.status(201).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = deleteExam;
