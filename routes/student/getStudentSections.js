const { pool } = require("../../config/db");

const getStudentSections = async (req, res) => {
  try {
    const studentsSectionQuery = await pool.query("SELECT * FROM exam_sections");
    const sectionsQuery = await pool.query("SELECT * FROM sections");
    const procedureQuery = await pool.query("SELECT * FROM procedures");
    const studentsSection = studentsSectionQuery.rows;
    const sections = sectionsQuery.rows;
    const procedure = procedureQuery.rows;
    return res.status(200).json({
      studentsSection: studentsSection,
      sections: sections,
      procedure: procedure,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

module.exports = getStudentSections;
