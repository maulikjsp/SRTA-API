const { pool } = require("../../config/db");

const getAllStudents = async (req, res) => {
  try {
    const studentsQuery = await pool.query(`
    select 
    "students"."id",
    "students"."uuid",
    "students"."name",
    "students"."email",
    "exams"."examcode",
    "exams"."id" AS "exam_id"
    from students
    inner join exams on "exams"."id" = "students"."exam_id"
    `);

    const students = studentsQuery.rows;

    return res.status(200).json({
      students: students,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = getAllStudents;
