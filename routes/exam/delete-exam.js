const { pool } = require("../../config/db");

const deleteExam = async (req, res) => {
  try {
    const id = req.params.id;
    // find sections according exam and delete them
    const sectionsQuery = await pool.query(`SELECT * FROM exam_sections WHERE exam_id=${id}`);
    const sections = sectionsQuery.rows;
    for (let i = 0; i < sections.length; i++) {
      await pool.query(`DELETE FROM sections WHERE id=${sections[i]["section_id"]}`);
      console.log("section deleted");
    }
    await pool.query(`DELETE FROM exams WHERE id=${id}`);
    await pool.query(`DELETE FROM exam_user WHERE exam_id=${id}`);
    await pool.query(`DELETE FROM students WHERE exam_id=${id}`);
    await pool.query(`DELETE FROM exam_sections WHERE exam_id=${id}`);

    return res.status(201).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.log(error, "error");
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = deleteExam;
