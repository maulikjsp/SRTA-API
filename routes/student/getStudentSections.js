const { pool } = require("../../config/db");

const getStudentSections = async (req, res) => {
  try {
    const id = req.params;
    const studentsSectionQuery = await pool.query(
      'select "exam_sections"."section_id" from exam_sections where exam_id = $1',
      [id]
    );
    const studentsSection = studentsSectionQuery.rows;
    return res.status(200).json({
      studentsSection: studentsSection,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

module.exports = getStudentSections;
