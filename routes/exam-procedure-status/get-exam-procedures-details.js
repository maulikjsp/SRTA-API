const { pool } = require("../../config/db");
const getExamProcedureDetails = async (req, res) => {
  try {
    const { procedure_id, student_id } = req.body;
    const query = await pool.query(
      `
      SELECT  
  "exam_procedure_status"."id",
  "exam_procedure_status"."procedureid",
  "exam_procedure_status"."examiner_id",
  "exam_procedure_status"."exam_id",
  "exam_procedure_status"."student_id",
  "exam_procedure_status"."status",
  "procedure_submission"."examiner_id",
  "procedure_submission"."questionnaires",
  "exams"."examcode",
  "exams"."active",
  "procedures"."title",
  "users"."name" AS "examiner_name",
  "roles"."role_name"
FROM "exam_procedure_status"
INNER JOIN "procedure_submission" ON "exam_procedure_status"."procedureid" = "procedure_submission"."procedure_id"
INNER JOIN "exams" ON "exam_procedure_status"."exam_id" = "exams"."id"
INNER JOIN "procedures" ON "exam_procedure_status"."procedureid" = "procedures"."id"
INNER JOIN "users" ON "procedure_submission"."examiner_id" = "users"."id"
INNER JOIN "roles" ON "users"."role_id" = "roles"."role_id"
WHERE "exam_procedure_status"."procedureid" = $1 AND "exam_procedure_status"."student_id" = $2 AND "procedure_submission"."student_id" = $2 AND "procedure_submission"."procedure_id" = $1
      `,
      [procedure_id, student_id]
    );

    return res.status(200).json({
      exam_procedure_status_details: query.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getExamProcedureDetails;
