const { pool } = require("../../config/db");

const createExamProcedure = async (req, res) => {
  try {
    const { procedureid, examiner_id, exam_id, assigned_date } = req.body;

    // Check if the record already exists
    const checkQuery = await pool.query(
      "SELECT * FROM exam_procedure_status WHERE procedureid = $1",
      [procedureid]
    );
    if (checkQuery.rows.length > 0) {
      return res.status(400).json({
        message: "Record already exists",
      });
    }

    // Insert data into the table
    const insertQuery = await pool.query(
      "INSERT INTO exam_procedure_status (procedureid, examiner_id, exam_id, assigned_date) VALUES ($1, $2, $3, $4)",
      [procedureid, examiner_id, exam_id, assigned_date]
    );

    return res.status(201).json({ message: "Student added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = createExamProcedure;
