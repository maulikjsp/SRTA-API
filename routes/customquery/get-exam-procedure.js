const { pool } = require("../../config/db");

const getExamProcedureStatusById = async (req, res) => {
  try {
    const id = req.params.id;
    const procedureQuery = await pool.query(
      `
       SELECT "exam_procedure_status"."procedureid",
      "exam_procedure_status"."examiner_id",
      "exam_procedure_status"."exam_id",
      "exam_procedure_status"."student_id"
FROM "exam_procedure_status"
WHERE "procedureid" = $1
       `,
      [id]
    );
    const queryData = procedureQuery.rows;
    return res.status(201).json({
      exam_procedures: queryData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getExamProcedureStatusById;
