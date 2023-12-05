const { pool } = require("../../config/db");

const getExamProcedureStatus = async (req, res) => {
  try {
    // Retrieve all records from the table
    const queryResult = await pool.query("SELECT * FROM exam_procedure_status");

    // Extract the rows from the query result
    const records = queryResult.rows;

    return res.status(200).json({ exam_procedure_status: records });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getExamProcedureStatus;
