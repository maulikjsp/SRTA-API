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
  "exam_submission"."examiner_id",
  "exam_submission"."criteria_id",
  "exam_submission"."criteria_ans",
  "exam_submission"."title" AS "criteria",
  "exams"."examcode",
  "exams"."active",
  "procedures"."title",
  "examiner_user"."name" AS "examiner_name",
  "manager_user"."name" AS "manager_name",
  "roles"."role_name",
  "students"."uuid",
  "manager_decision"."manager_decision"
FROM "exam_procedure_status"
INNER JOIN "students" ON "students"."id" = "exam_procedure_status"."student_id"
LEFT JOIN "exam_submission" ON "exam_procedure_status"."procedureid" = "exam_submission"."procedure_id" AND "exam_submission"."student_id" = "exam_procedure_status"."student_id"
LEFT JOIN "manager_decision" ON "manager_decision"."criteria_id" = "exam_submission"."criteria_id"
LEFT JOIN "exams" ON "exam_procedure_status"."exam_id" = "exams"."id"
INNER JOIN "procedures" ON "exam_procedure_status"."procedureid" = "procedures"."id"
INNER JOIN "users" AS "examiner_user" ON "exam_submission"."examiner_id" = "examiner_user"."id"
LEFT JOIN "users" AS "manager_user" ON "manager_decision"."manager_id" = "manager_user"."id"
INNER JOIN "roles" ON "examiner_user"."role_id" = "roles"."role_id"
WHERE "exam_procedure_status"."procedureid" = $1 AND "exam_procedure_status"."student_id" = $2 AND ("exam_submission"."student_id" = $2 OR "exam_submission"."student_id" IS NULL) AND ("exam_submission"."procedure_id" = $1 OR "exam_submission"."procedure_id" IS NULL);

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
