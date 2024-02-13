const { pool } = require("../../config/db");

const getStudents = async (req, res) => {
  try {
    const studentsQuery = await pool.query(`
    SELECT *
         , exams.active
    FROM students
    INNER JOIN exams ON students.exam_id = exams.id
    WHERE active = true
    `);

    const students = studentsQuery.rows;

    return res.status(200).json({
      students: students,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = getStudents;
