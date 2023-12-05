const { pool } = require("../../config/db");

const getStudentSections = async (req, res) => {
  try {
    const { id } = req.params;
    const studentsSectionQuery = await pool.query(
      'SELECT "exam_sections"."section_id" FROM exam_sections WHERE exam_id = $1',
      [id]
    );
    const studentsSection = studentsSectionQuery.rows;
    return res.status(200).json({
      studentsSection: studentsSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

module.exports = getStudentSections;
