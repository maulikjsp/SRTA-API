const { pool } = require("../../config/db");

const getExamProcedureStatus = async (req, res) => {
  try {
    // Retrieve all records from the table
    const queryResult = await pool.query(`
    SELECT
    "exam_procedure_status"."id",
    "exam_procedure_status"."student_id" AS "studentCode",
    "exams"."active" AS "currentExamStatus",
    "procedures"."title" AS "onGoingProcedure",
    "users"."name" AS "currentAssignedExaminer",
    "exam_procedure_status"."assigned_date" AS "AssignedDate",
    "exam_procedure_status"."procedureid",
    "exam_procedure_status"."examiner_id",
    "exam_procedure_status"."exam_id",
    "exams"."examname"
FROM  
    exam_procedure_status
INNER JOIN 
    "procedures" ON "procedures"."id" = "exam_procedure_status"."procedureid"
INNER JOIN 
    "exams" ON "exams"."id" = "exam_procedure_status"."exam_id"
INNER JOIN
    "users" ON "users"."id" = "exam_procedure_status"."examiner_id"`);

    // Extract the rows from the query result
    const records = queryResult.rows;

    return res.status(200).json({ exam_procedure_status: records });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getExamProcedureStatus;
