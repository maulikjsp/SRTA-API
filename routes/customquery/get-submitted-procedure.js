const { pool } = require("../../config/db");

const getSubmittedExamProcedures = async (req, res) => {
  try {
    const procedureQuery = await pool.query(
      `
      SELECT DISTINCT 
    "procedure_submission"."student_id",
    "procedure_submission"."examiner_id",
    "procedure_submission"."procedure_id"
  FROM   
    procedure_submission;
       `
    );
    const queryData = procedureQuery.rows;
    return res.status(201).json({
      submitted_procedures: queryData,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getSubmittedExamProcedures;
