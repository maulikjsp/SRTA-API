const { pool } = require("../../config/db");

const deleteExam = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id, "id");
    await pool.query(`DELETE FROM exams WHERE id=${id}`);
    await pool.query(`DELETE FROM exam_user WHERE exam_id=${id}`);
    return res.status(201).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = deleteExam;
