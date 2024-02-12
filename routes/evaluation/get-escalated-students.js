const { pool } = require("../../config/db");

const getEscalatedStudent = async (req, res) => {
  try {
    const escalatedQuery = await pool.query(
      `SELECT
      id,
      procedureid,
      examiner_id,
      student_id,
      status,
      escalated,
      procedures.title AS procedure_name
  FROM 
      exam_procedure_status
  INNER JOIN 
      students ON exam_procedure_status.student_id = students.id
  INNER JOIN 
      procedures ON exam_procedure_status.procedureid = procedures.id
  WHERE 
      escalated = true;
  `
    );
    return res.status(201).json({
      students: escalatedQuery.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = getEscalatedStudent;
