const { pool } = require("../../config/db");

const getStudentsStatus = async (req, res) => {
  try {
    const studentsDataQuery = await pool.query(`
    SELECT "students"."name",
    "exam_procedure_status"."procedureid",
    "exam_procedure_status"."status",
    "procedures"."title",
    "exams"."examname",
    "users"."name" AS "examiner"
    
    FROM "students"
    INNER JOIN "exam_procedure_status" ON "exam_procedure_status"."student_id" = "students"."id"
    INNER JOIN "procedures" ON "procedures"."id" = "exam_procedure_status"."procedureid"
    INNER JOIN "exams" ON "exams"."id" = "exam_procedure_status"."exam_id"
    LEFT JOIN  "users" ON "users"."id" = "exam_procedure_status"."examiner_id"
       `);
    return res.status(200).json({ students: studentsDataQuery.rows });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = getStudentsStatus;
