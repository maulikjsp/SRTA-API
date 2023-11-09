const { pool } = require("../../config/db");

const getStudents = async (req, res) => {
  try {
    const studentsQuery = await pool.query("SELECT * FROM students");

    const students = studentsQuery.rows;

    return res.status(200).json({
      students: students,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = getStudents;
