const { pool } = require("../../config/db");

const getStudents = async (req, res) => {
  try {
    const studentsQuery = await pool.query(`
    SELECT 
    "students"."sequence_number",
    "students"."ext_student_id",
    "students"."exam_id",
    "students"."name",
    "students"."email",
    "students"."address",
    "students"."phone",
    "students"."school",
    "students"."graduation_date",
    "students"."surname",
    "students"."social",
    "students"."id"
  FROM students
  INNER JOIN exams ON "students"."exam_id" = "exams"."id"
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
